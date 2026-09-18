import { PrismaPg } from '@prisma/adapter-pg'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import nextEnv from '@next/env'
nextEnv.loadEnvConfig(process.cwd())
if (
    process.env.DATABASE_URL !==
    'postgresql://demo:local-demo-only@127.0.0.1:5199/tofu_movies'
)
    throw new Error('Only the disposable local database may be tested')
const database = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})
const base = 'http://127.0.0.1:5198'
const users = [],
    lists = [],
    movies = []
let checks = 0
async function request(path, token, method = 'GET', data, expected = 200) {
    const response = await fetch(base + path, {
        method,
        headers: {
            ...(token ? { cookie: `next-auth.session-token=${token}` } : {}),
            ...(data ? { 'content-type': 'application/json' } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
        redirect: 'manual',
    })
    assert.equal(
        response.status,
        expected,
        `${method} ${path}: expected ${expected}, got ${response.status}`
    )
    checks++
    return response.headers.get('content-type')?.includes('application/json')
        ? response.json()
        : response.text()
}
try {
    for (const name of ['owner', 'member', 'stranger']) {
        const token = randomUUID()
        const user = await database.user.create({
            data: {
                name,
                email: `${name}-${randomUUID()}@example.invalid`,
                sessions: {
                    create: {
                        sessionToken: token,
                        expires: new Date(Date.now() + 600000),
                    },
                },
            },
        })
        users.push({ ...user, token })
    }
    const [owner, member, stranger] = users
    const movie = await database.movie.create({
        data: {
            tmdb_id: Math.floor(Math.random() * 1000000000),
            title: 'Local test film',
        },
    })
    movies.push(movie.id)
    const list = await database.movieList.create({
        data: {
            title: 'Private fixture',
            description: 'Disposable test list',
            createdBy: owner.email,
            users: { connect: [{ id: owner.id }, { id: member.id }] },
        },
    })
    lists.push(list.id)
    const path = `/api/movieLists/${list.id}`
    await request(path, null, 'GET', undefined, 401)
    await request(path, stranger.token, 'GET', undefined, 404)
    await request(path, member.token)
    await request(path, owner.token)
    assert.ok(
        await database.movieList.findUnique({ where: { id: list.id } }),
        'GET must never delete the list'
    )
    checks++
    await request(path, member.token, 'DELETE', undefined, 403)
    await request(path, stranger.token, 'PUT', { title: 'Stolen' }, 404)
    await request(path, member.token, 'PUT', { title: 'Stolen' }, 403)
    await request(path, owner.token, 'PUT', { createdBy: stranger.email }, 400)
    await request(path, owner.token, 'PUT', { users: { deleteMany: {} } }, 400)
    await request(path, member.token, 'PUT', {
        movies: { connect: { tmdb_id: movie.tmdb_id } },
    })
    await request(path, owner.token, 'PUT', { allowEdits: false })
    await request(
        path,
        member.token,
        'PUT',
        { movies: { disconnect: { tmdb_id: movie.tmdb_id } } },
        403
    )
    await request(path, owner.token, 'PUT', { isPublic: true })
    await request(path, stranger.token)
    await request(
        path,
        stranger.token,
        'PUT',
        { users: { connect: { email: member.email } } },
        403
    )
    await request(path, stranger.token, 'PUT', {
        users: { connect: { email: stranger.email } },
    })
    await request(path, stranger.token, 'PUT', {
        users: { disconnect: { email: stranger.email } },
    })
    await request(
        path,
        owner.token,
        'PUT',
        { users: { disconnect: { email: owner.email } } },
        403
    )
    const created = await request(
        '/api/movieLists',
        owner.token,
        'POST',
        { title: 'Created by session', description: 'Local fixture' },
        201
    )
    lists.push(created.id)
    assert.equal(created.createdBy, owner.email)
    assert.deepEqual(created.users, [{ id: owner.id }])
    await request(
        '/api/movieLists',
        owner.token,
        'POST',
        { title: 'Spoofed', description: '', createdBy: stranger.email },
        400
    )
    await request(
        `/api/users/${owner.id}`,
        member.token,
        'PUT',
        { name: 'Stolen' },
        403
    )
    await request(
        `/api/users/${owner.id}`,
        owner.token,
        'PUT',
        { email: stranger.email },
        400
    )
    await request(
        `/api/users/${owner.id}`,
        owner.token,
        'PUT',
        { sessions: { deleteMany: {} } },
        400
    )
    await request(`/api/users/${owner.id}`, owner.token, 'PUT', {
        name: 'Updated locally',
        email: owner.email,
    })
    const review = await database.userReview.create({
        data: {
            title: 'Test review',
            review: 'Synthetic review text',
            rating: 7,
            reviewerId: owner.id,
            movieId: movie.id,
        },
    })
    const reviewBody = {
        title: 'Edited review',
        review: 'More synthetic text',
        rating: 8,
    }
    await request(
        `/api/reviews/${review.id}`,
        member.token,
        'PUT',
        reviewBody,
        404
    )
    await request(
        `/api/reviews/${review.id}`,
        owner.token,
        'PUT',
        { ...reviewBody, reviewerId: member.id },
        400
    )
    await request(`/api/reviews/${review.id}`, owner.token, 'PUT', reviewBody)
    const watched = await request(
        '/api/userMovies',
        owner.token,
        'POST',
        { movie: { connect: { tmdb_id: movie.tmdb_id } }, seen: true },
        201
    )
    await request(
        `/api/userMovies/${watched.id}`,
        stranger.token,
        'GET',
        undefined,
        404
    )
    await request(
        `/api/userMovies/${watched.id}`,
        stranger.token,
        'PUT',
        { seen: false },
        404
    )
    await request(
        `/api/userMovies/${watched.id}`,
        owner.token,
        'PUT',
        { seen: false, userId: stranger.id },
        400
    )
    await request(`/api/userMovies/${watched.id}`, owner.token, 'PUT', {
        id: watched.id,
        seen: false,
    })
    assert.equal(
        (await database.userMovie.findUnique({ where: { id: watched.id } }))
            .seen,
        false
    )
    await request(
        '/api/userMovies',
        owner.token,
        'POST',
        {
            movie: { connect: { tmdb_id: movie.tmdb_id } },
            user: { connect: { id: stranger.id } },
        },
        400
    )
    await request(
        '/api/userMovies',
        owner.token,
        'POST',
        { movie: { update: { title: 'Hijacked' } } },
        400
    )
    await request(
        '/api/reviews',
        owner.token,
        'POST',
        {
            ...reviewBody,
            movie: { connect: { tmdb_id: movie.tmdb_id } },
            reviewer: { connect: { id: stranger.id } },
        },
        400
    )
    const postedReview = await request(
        '/api/reviews',
        owner.token,
        'POST',
        {
            ...reviewBody,
            review: '<p>Hello</p><img src=x onerror=alert(1)><script>alert(1)</script>',
            movie: { connect: { tmdb_id: movie.tmdb_id } },
        },
        201
    )
    assert.equal(postedReview.reviewerId, owner.id)
    assert.equal(postedReview.review, '<p>Hello</p>')
    const reviews = await request('/api/reviews', owner.token)
    assert.ok(reviews.every(item => !('email' in item.reviewer)))
    await request(
        '/api/reviews?orderBy=reviewerId',
        owner.token,
        'GET',
        undefined,
        400
    )
    await request(
        `/api/reviews/${postedReview.id}/reaction`,
        member.token,
        'PUT',
        { action: 'LIKE' }
    )
    await request(
        `/api/reviews/${postedReview.id}/reaction`,
        member.token,
        'PUT',
        { action: 'DISLIKE' }
    )
    assert.equal(
        await database.reviewLikeDislike.count({
            where: { reviewId: postedReview.id, reviewerId: member.id },
        }),
        1
    )
    await request(
        `/api/reviews/${postedReview.id}/reaction`,
        member.token,
        'PUT',
        { action: 'LIKE', reviewerId: stranger.id },
        400
    )
    const provider = await request(
        '/api/userProviders',
        owner.token,
        'POST',
        { tmdb_id: 123, provider_name: 'Synthetic provider', linked: false },
        201
    )
    await request(
        `/api/userProviders/${provider.id}`,
        stranger.token,
        'PUT',
        { linked: true },
        404
    )
    await request(
        `/api/userProviders/${provider.id}`,
        owner.token,
        'PUT',
        { linked: true, userId: stranger.id },
        400
    )
    await request(
        '/api/userProviders',
        owner.token,
        'POST',
        { tmdb_id: 456, user: { connect: { email: stranger.email } } },
        400
    )
    await request(
        '/api/userProviders/linkAll',
        stranger.token,
        'POST',
        { toCreate: [], toUpdate: [{ id: provider.id, linked: true }] },
        404
    )
    assert.equal(
        (await database.userProvider.findUnique({ where: { id: provider.id } }))
            .linked,
        false
    )
    await request(
        '/api/userProviders/linkAll',
        owner.token,
        'GET',
        undefined,
        405
    )
    await request('/api/userProviders/linkAll', owner.token, 'POST', {
        toCreate: [],
        toUpdate: [{ id: provider.id, linked: true }],
    })
    assert.equal(
        (await database.userProvider.findUnique({ where: { id: provider.id } }))
            .linked,
        true
    )
    await request('/api/config', null, 'GET', undefined, 401)
    await request('/api/config', owner.token, 'GET', undefined, 503)
    await request('/api/config', owner.token, 'POST', {}, 405)
    await request('/api/uploadImage', null, 'POST', {}, 401)
    await request('/api/uploadImage', owner.token, 'POST', {}, 503)
    await request(
        `/api/movies/${movie.id}`,
        owner.token,
        'PUT',
        { title: 'Hijacked' },
        405
    )
    const catalogue = await request('/api/movies', owner.token)
    assert.ok(catalogue.every(item => item.lists.every(list => list.isPublic)))
    await request(path, owner.token, 'DELETE')
    assert.equal(
        await database.movieList.findUnique({ where: { id: list.id } }),
        null
    )
    checks++
    await request(`/movieLists/${created.id}`, null, 'GET', undefined, 307)
    await request(
        `/movieLists/${created.id}`,
        stranger.token,
        'GET',
        undefined,
        404
    )
    console.log(
        `PASS: ${checks} HTTP/database checks, including GET preservation, ownership, membership, nested-write rejection, profile/review isolation, and server-rendered access.`
    )
} finally {
    await database.movieList.deleteMany({ where: { id: { in: lists } } })
    await database.reviewLikeDislike.deleteMany({
        where: { reviewerId: { in: users.map(user => user.id) } },
    })
    await database.userMovie.deleteMany({
        where: { userId: { in: users.map(user => user.id) } },
    })
    await database.userProvider.deleteMany({
        where: { userId: { in: users.map(user => user.id) } },
    })
    await database.userReview.deleteMany({
        where: { reviewerId: { in: users.map(user => user.id) } },
    })
    await database.movie.deleteMany({ where: { id: { in: movies } } })
    await database.user.deleteMany({
        where: { id: { in: users.map(user => user.id) } },
    })
    await database.$disconnect()
}
