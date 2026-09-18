import { withVisitorGuard } from 'server/visitor'
import prisma from '@/prisma'
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import {
    canReadList,
    canEditListMovies,
    fullMovieList,
    ownsList,
    ListUpdate,
    metadata,
} from '../../../server/movieLists'
export { getMovieList } from '../../../server/movieLists'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!['GET', 'PUT', 'DELETE'].includes(req.method || '')) {
        res.setHeader('Allow', 'GET, PUT, DELETE')
        return void res.status(405).json({ error: 'Method not allowed' })
    }
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId || !session.user.email)
        return void res.status(401).json({ error: 'Sign in required' })
    if (typeof req.query.id !== 'string')
        return void res.status(400).json({ error: 'Invalid list ID' })
    const id = req.query.id
    const viewer = { id: session.user.userId, email: session.user.email }
    try {
        const result = await prisma.$transaction(
            async database => {
                const list = await database.movieList.findUnique({
                    where: { id },
                    ...fullMovieList,
                })
                if (!list || !canReadList(list, viewer))
                    return { status: 404, body: { error: 'List not found' } }
                if (req.method === 'GET') return { status: 200, body: list }
                if (req.method === 'DELETE') {
                    if (!ownsList(list, viewer))
                        return {
                            status: 403,
                            body: {
                                error: 'Only the owner can delete this list',
                            },
                        }
                    return {
                        status: 200,
                        body: await database.movieList.delete({
                            where: { id },
                            ...fullMovieList,
                        }),
                    }
                }
                const parsed = ListUpdate.safeParse(req.body)
                if (!parsed.success)
                    return {
                        status: 400,
                        body: { error: 'Invalid list update' },
                    }
                const input = parsed.data
                if (
                    process.env.VISITOR_DEMO === 'true' &&
                    input.movies?.create
                ) {
                    return {
                        status: 403,
                        body: { error: 'The sample catalogue is read-only.' },
                    }
                }
                if (
                    (input.id && input.id !== id) ||
                    input.createdBy !== undefined ||
                    input.created !== undefined
                ) {
                    return {
                        status: 400,
                        body: { error: 'List identity cannot be changed' },
                    }
                }
                const hasMetadata = [
                    'title',
                    'description',
                    'image',
                    'isPublic',
                    'allowEdits',
                ].some(key => key in input)
                if (
                    (hasMetadata && !ownsList(list, viewer)) ||
                    (input.movies && !canEditListMovies(list, viewer))
                ) {
                    return {
                        status: 403,
                        body: { error: 'You cannot edit this list' },
                    }
                }
                if (input.users) {
                    const { connect, disconnect } = input.users
                    if (
                        (!connect && !disconnect) ||
                        (connect && disconnect) ||
                        (connect &&
                            (connect.email !== viewer.email ||
                                !list.isPublic)) ||
                        (disconnect &&
                            (disconnect.email !== viewer.email ||
                                ownsList(list, viewer)))
                    ) {
                        return {
                            status: 403,
                            body: {
                                error: 'You can only follow or unfollow a public list as yourself',
                            },
                        }
                    }
                }
                const updated = await database.movieList.update({
                    where: { id },
                    data: {
                        ...metadata(input),
                        movies: input.movies,
                        users: input.users,
                        updatedAt: new Date(),
                        ...(input.views !== undefined
                            ? { views: { increment: 1 } }
                            : {}),
                    },
                    ...fullMovieList,
                })
                return { status: 200, body: updated }
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
        )
        return void res.status(result.status).json(result.body)
    } catch {
        return void res
            .status(500)
            .json({ error: 'Could not update movie list. Please retry.' })
    }
}

export default withVisitorGuard(handler)
