import prisma from '@/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { matchesViewer, ProviderCreate } from '../../../server/writeSchemas'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId)
        return void res.status(401).json({ error: 'Sign in required' })
    const userId = session.user.userId
    try {
        if (req.method === 'GET')
            return void res
                .status(200)
                .json(await prisma.userProvider.findMany({ where: { userId } }))
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'GET, POST')
            return void res.status(405).json({ error: 'Method not allowed' })
        }
        const parsed = ProviderCreate.safeParse(req.body)
        if (
            !parsed.success ||
            (parsed.data.userId && parsed.data.userId !== userId) ||
            !matchesViewer(parsed.data.user, {
                id: userId,
                email: session.user.email,
            })
        )
            return void res.status(400).json({ error: 'Invalid provider' })
        const { id, tmdb_id, logo, provider_name, linked } = parsed.data
        return void res
            .status(201)
            .json(
                await prisma.userProvider.upsert({
                    where: { userId_tmdb_id: { userId, tmdb_id } },
                    create: {
                        id,
                        tmdb_id,
                        logo,
                        provider_name,
                        linked,
                        userId,
                    },
                    update: { linked },
                })
            )
    } catch {
        return void res.status(400).json({ error: 'Could not save provider' })
    }
}
