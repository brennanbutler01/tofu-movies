import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import prisma from '@/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { matchesViewer, UserMovieCreate } from '../../../server/writeSchemas'
export const getUserMovies = (userId: string) =>
    prisma.userMovie.findMany({ where: { userId } })
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId)
        return void res.status(401).json({ error: 'Sign in required' })
    try {
        if (req.method === 'GET')
            return void res
                .status(200)
                .json(await getUserMovies(session.user.userId))
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'GET, POST')
            return void res.status(405).json({ error: 'Method not allowed' })
        }
        const parsed = UserMovieCreate.safeParse(req.body)
        if (
            !parsed.success ||
            !matchesViewer(parsed.data.user, {
                id: session.user.userId,
                email: session.user.email,
            })
        )
            return void res.status(400).json({ error: 'Invalid watch record' })
        const { id, seen, movie } = parsed.data
        const record = await prisma.userMovie.create({
            data: {
                id,
                seen,
                movie,
                user: { connect: { id: session.user.userId } },
            },
        })
        return void res.status(201).json(record)
    } catch {
        return void res
            .status(400)
            .json({ error: 'Could not save watch record' })
    }
}
