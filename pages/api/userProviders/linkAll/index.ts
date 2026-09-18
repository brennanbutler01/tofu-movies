import prisma from '@/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { matchesViewer, ProviderBatch } from '../../../../server/writeSchemas'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId)
        return void res.status(401).json({ error: 'Sign in required' })
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return void res.status(405).json({ error: 'Method not allowed' })
    }
    const parsed = ProviderBatch.safeParse(req.body)
    const userId = session.user.userId
    if (
        !parsed.success ||
        parsed.data.toCreate.some(
            item =>
                (item.userId && item.userId !== userId) ||
                !matchesViewer(item.user, {
                    id: userId,
                    email: session.user.email,
                })
        )
    )
        return void res.status(400).json({ error: 'Invalid providers' })
    try {
        const result = await prisma.$transaction(async database => {
            const ids = [...new Set(parsed.data.toUpdate.map(item => item.id))]
            const existing = await database.userProvider.findMany({
                where: { id: { in: ids }, userId },
            })
            if (existing.length !== ids.length) return null
            await database.userProvider.createMany({
                data: parsed.data.toCreate.map(
                    ({ id, tmdb_id, logo, provider_name }) => ({
                        id,
                        tmdb_id,
                        logo,
                        provider_name,
                        userId,
                        linked: true,
                    })
                ),
                skipDuplicates: true,
            })
            await database.userProvider.updateMany({
                where: {
                    userId,
                    OR: [
                        { id: { in: ids } },
                        {
                            tmdb_id: {
                                in: parsed.data.toCreate.map(
                                    item => item.tmdb_id
                                ),
                            },
                        },
                    ],
                },
                data: { linked: true },
            })
            return database.userProvider.findMany({ where: { userId } })
        })
        return void res
            .status(result ? 200 : 404)
            .json(result || { error: 'Provider not found' })
    } catch {
        return void res.status(400).json({ error: 'Could not link providers' })
    }
}
