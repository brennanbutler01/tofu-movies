import { withVisitorGuard } from 'server/visitor'
import prisma from '@/prisma'
import { reviewHtml } from '../../../utils/reviewHtml'
import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { HttpMethods } from 'utils/httpMethods'
import { reviewWithMovie } from '.'
import { authOptions } from '../auth/[...nextauth]'

export const getReview = async (id: string, userId?: string) =>
    await prisma.userReview.findUnique({
        where: {
            id,
            ...(process.env.VISITOR_DEMO === 'true'
                ? { reviewerId: userId || 'no-visitor' }
                : {}),
        },
        ...reviewWithMovie,
    })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    if (typeof req.query.id !== 'string')
        return void res.status(400).json({ error: 'Invalid review ID' })
    const id = req.query.id
    const session = await getServerSession(req, res, authOptions)

    if (session?.user) {
        try {
            switch (method) {
                case HttpMethods.GET:
                    const thisReview = await getReview(id, session.user.userId)
                    if (!thisReview)
                        return void res
                            .status(404)
                            .json({ error: 'Review not found' })
                    res.status(200).json(thisReview)
                    break
                case HttpMethods.PUT:
                    const input = z
                        .object({
                            title: z.string().trim().min(1).max(200),
                            review: z.string().max(20000),
                            rating: z.number().int().min(1).max(10),
                        })
                        .strict()
                        .safeParse(req.body)
                    if (!input.success)
                        return void res
                            .status(400)
                            .json({ error: 'Invalid review' })
                    const existing = await getReview(id, session.user.userId)
                    if (
                        !existing ||
                        existing.reviewerId !== session.user.userId
                    )
                        return void res
                            .status(404)
                            .json({ error: 'Review not found' })
                    const review = await prisma.userReview.update({
                        where: {
                            id: id.toString(),
                        },
                        data: {
                            ...input.data,
                            review: reviewHtml(input.data.review),
                            updatedAt: new Date(),
                        },
                    })
                    res.status(200).json(review)
                    break
                default:
                    res.status(403).json({
                        err:
                            'Review api endpoint does not accept ' +
                            method +
                            ' requests',
                    })
            }
        } catch (err) {
            const errString =
                method + ' request for reviews failed... err: ' + err
            res.status(500).json({ error: 'Could not process review' })
        }
    } else {
        res.status(401).json({
            err: 'You must be authorized to view this api endpoint',
        })
    }
}
export default withVisitorGuard(handler)
