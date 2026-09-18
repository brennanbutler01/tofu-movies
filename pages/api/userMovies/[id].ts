import { withVisitorGuard } from 'server/visitor'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { UserMovieUpdate } from '../../../server/writeSchemas'
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId)
        return void res.status(401).json({ error: 'Sign in required' })
    if (typeof req.query.id !== 'string')
        return void res.status(400).json({ error: 'Invalid watch record ID' })
    const where = { id: req.query.id, userId: session.user.userId }
    try {
        if (req.method === 'GET') {
            const record = await prisma.userMovie.findFirst({ where })
            return void res
                .status(record ? 200 : 404)
                .json(record || { error: 'Watch record not found' })
        }
        if (req.method !== 'PUT') {
            res.setHeader('Allow', 'GET, PUT')
            return void res.status(405).json({ error: 'Method not allowed' })
        }
        const parsed = UserMovieUpdate.safeParse(req.body)
        if (!parsed.success || (parsed.data.id && parsed.data.id !== where.id))
            return void res
                .status(400)
                .json({ error: 'Invalid watch record update' })
        const result = await prisma.userMovie.updateMany({
            where,
            data: { seen: parsed.data.seen },
        })
        if (!result.count)
            return void res
                .status(404)
                .json({ error: 'Watch record not found' })
        return void res
            .status(200)
            .json(await prisma.userMovie.findFirst({ where }))
    } catch {
        return void res
            .status(500)
            .json({ error: 'Could not update watch record' })
    }
}

export default withVisitorGuard(handler)
