import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
const values = Object.fromEntries(
    (await readFile('.env.local', 'utf8'))
        .split('\n')
        .filter(line => line.includes('=') && !line.startsWith('#'))
        .map(line => {
            const i = line.indexOf('=')
            return [line.slice(0, i), line.slice(i + 1)]
        })
)
const expected = 'postgresql://demo:local-demo-only@127.0.0.1:5199/tofu_movies'
assert.equal(
    values.DATABASE_URL,
    expected,
    'Lifecycle tests require the disposable local database.'
)
const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: expected }),
})
const base = 'http://127.0.0.1:5218'
const sessions = []
async function start() {
    const r = await fetch(base + '/api/demo/session', {
        method: 'POST',
        headers: { Origin: base },
    })
    assert.equal(r.status, 200)
    const data = await r.json()
    const cookie = r.headers.get('set-cookie').split(';')[0]
    const session = { ...data, cookie }
    sessions.push(session)
    return session
}
function request(session, path, method = 'GET', body) {
    return fetch(base + path, {
        method,
        headers: {
            Cookie: session.cookie,
            Origin: base,
            'Content-Type': 'application/json',
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    })
}
try {
    const session = await start()
    const created = await request(session, '/api/movieLists', 'POST', {
        title: 'Concurrent cleanup',
        description: 'Synthetic',
    })
    assert.equal(created.status, 201)
    const operations = await Promise.all([
        request(session, '/api/movieLists', 'POST', {
            title: 'Racing write',
            description: 'Synthetic',
        }),
        request(session, '/api/demo/session', 'DELETE'),
    ])
    assert.equal(operations[1].status, 204)
    assert.equal(await db.user.count({ where: { id: session.userId } }), 0)
    assert.equal(
        await db.movieList.count({ where: { ownerId: session.userId } }),
        0
    )
    assert.equal(
        await db.session.count({ where: { userId: session.userId } }),
        0
    )
    assert.equal((await request(session, '/api/movieLists')).status, 401)
    const expired = await start()
    await db.demoVisit.update({
        where: { userId: expired.userId },
        data: { expiresAt: new Date(Date.now() - 1000) },
    })
    assert.equal((await request(expired, '/api/movieLists')).status, 401)
    await start()
    assert.equal(await db.user.count({ where: { id: expired.userId } }), 0)
    assert.equal(
        await db.movieList.count({ where: { ownerId: expired.userId } }),
        0
    )
    const limited = await start()
    await db.demoVisit.update({
        where: { userId: limited.userId },
        data: { requests: 999 },
    })
    assert.equal((await request(limited, '/api/movieLists')).status, 200)
    assert.equal((await request(limited, '/api/movieLists')).status, 429)
    assert.equal(
        (await request(limited, '/api/demo/session', 'DELETE')).status,
        204
    )
    console.log(
        'Passed: concurrent reset, physical cleanup, expiry cleanup and persisted request budget.'
    )
} finally {
    for (const session of sessions)
        await request(session, '/api/demo/session', 'DELETE')
    await db.$disconnect()
}
