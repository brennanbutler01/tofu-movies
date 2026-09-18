import prisma from '@/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '../../auth/[...nextauth]'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId)
        return void res.status(401).json({ error: 'Sign in required' })
    if (req.method !== 'PUT') {
        res.setHeader('Allow', 'PUT')
        return void res.status(405).json({ error: 'Method not allowed' })
    }
    const parsed = z
        .object({ action: z.enum(['LIKE', 'DISLIKE']) })
        .strict()
        .safeParse(req.body)
    if (!parsed.success || typeof req.query.id !== 'string')
        return void res.status(400).json({ error: 'Invalid reaction' })
    const reviewId = req.query.id,
        reviewerId = session.user.userId
    try {
        if (!(await prisma.userReview.findUnique({ where: { id: reviewId } })))
            return void res.status(404).json({ error: 'Review not found' })
        return void res.status(200).json(
            await prisma.reviewLikeDislike.upsert({
                where: { reviewId_reviewerId: { reviewId, reviewerId } },
                create: { reviewId, reviewerId, action: parsed.data.action },
                update: { action: parsed.data.action, updatedAt: new Date() },
            })
        )
    } catch {
        return void res.status(400).json({ error: 'Could not save reaction' })
    }
}
