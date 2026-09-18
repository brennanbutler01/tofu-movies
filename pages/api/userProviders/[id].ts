import { withVisitorGuard } from 'server/visitor'
import prisma from '@/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { ProviderUpdate } from '../../../server/writeSchemas'
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId)
        return void res.status(401).json({ error: 'Sign in required' })
    if (req.method !== 'PUT') {
        res.setHeader('Allow', 'PUT')
        return void res.status(405).json({ error: 'Method not allowed' })
    }
    if (typeof req.query.id !== 'string')
        return void res.status(400).json({ error: 'Invalid provider ID' })
    const parsed = ProviderUpdate.safeParse(req.body)
    if (!parsed.success || (parsed.data.id && parsed.data.id !== req.query.id))
        return void res.status(400).json({ error: 'Invalid provider update' })
    const where = {
        id: req.query.id,
        userId: session.user.userId,
        tmdb_id: parsed.data.tmdb_id,
    }
    try {
        const result = await prisma.userProvider.updateMany({
            where,
            data: { linked: parsed.data.linked },
        })
        if (!result.count)
            return void res.status(404).json({ error: 'Provider not found' })
        return void res
            .status(200)
            .json(await prisma.userProvider.findFirst({ where }))
    } catch {
        return void res.status(500).json({ error: 'Could not update provider' })
    }
}

export default withVisitorGuard(handler)
