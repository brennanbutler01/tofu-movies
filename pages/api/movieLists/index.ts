import prisma from '@/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import {
    fullMovieList,
    getUserMovieLists,
    ListCreate,
    metadata,
} from '../../../server/movieLists'
export { fullMovieList, getUserMovieLists } from '../../../server/movieLists'
export type { FullMovieList } from '../../../server/movieLists'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!['GET', 'POST'].includes(req.method || '')) {
        res.setHeader('Allow', 'GET, POST')
        return void res.status(405).json({ error: 'Method not allowed' })
    }
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId || !session.user.email)
        return void res.status(401).json({ error: 'Sign in required' })
    try {
        if (req.method === 'GET')
            return void res
                .status(200)
                .json(await getUserMovieLists(session.user.email))
        const parsed = ListCreate.safeParse(req.body)
        if (!parsed.success)
            return void res.status(400).json({ error: 'Invalid list' })
        const input = parsed.data
        if (
            input.users?.disconnect ||
            input.movies?.disconnect ||
            (input.users?.connect &&
                input.users.connect.email !== session.user.email) ||
            (input.createdBy && input.createdBy !== session.user.email)
        ) {
            return void res
                .status(400)
                .json({ error: 'Invalid list ownership' })
        }
        const list = await prisma.movieList.create({
            data: {
                ...metadata(input),
                id: input.id,
                title: input.title,
                description: input.description,
                movies: input.movies,
                createdBy: session.user.email,
                users: { connect: { id: session.user.userId } },
            },
            ...fullMovieList,
        })
        return void res.status(201).json(list)
    } catch {
        return void res.status(500).json({ error: 'Could not save movie list' })
    }
}
