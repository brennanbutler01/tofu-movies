import { visitorMovieRelation } from 'server/visitorMovieRelation'
import { withVisitorGuard } from 'server/visitor'
import {
    OrderByDirections,
    ReviewOrderBy,
} from '@/components/movieReviews/ReviewOrderBySelect'
import prisma from '@/prisma'
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { ReviewCreate, matchesViewer } from '../../../server/writeSchemas'
import { reviewHtml } from '../../../utils/reviewHtml'
import { z } from 'zod'
import { authOptions } from '../auth/[...nextauth]'

export const reviewWithMovie = Prisma.validator<Prisma.UserReviewDefaultArgs>()(
    {
        include: {
            movie: {
                include: {
                    ratings: true,
                },
            },
            reviewer: { select: { id: true, name: true, image: true } },
            likesDislikes: true,
        },
    }
)

export type ReviewWithMovie = Prisma.UserReviewGetPayload<
    typeof reviewWithMovie
>

export const getReviews = async (
    orderBy: ReviewOrderBy.CREATED | ReviewOrderBy.RATING,
    sortOrder: OrderByDirections,
    userId?: string
) => {
    return prisma.userReview.findMany({
        ...reviewWithMovie,
        ...(process.env.VISITOR_DEMO === 'true'
            ? { where: { reviewerId: userId || 'no-visitor' } }
            : {}),
        orderBy: {
            [orderBy]: sortOrder,
        },
    })
}
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId)
        return void res.status(401).json({ error: 'Sign in required' })
    try {
        if (req.method === 'GET') {
            const order = z
                .enum(['created', 'rating'])
                .safeParse(req.query.orderBy || 'created')
            const direction = z
                .enum(['asc', 'desc'])
                .safeParse(req.query.sortOrder || 'desc')
            if (!order.success || !direction.success)
                return void res
                    .status(400)
                    .json({ error: 'Invalid sort order' })
            return void res.status(200).json(
                await prisma.userReview.findMany({
                    ...reviewWithMovie,
                    ...(process.env.VISITOR_DEMO === 'true'
                        ? { where: { reviewerId: session.user.userId } }
                        : {}),
                    orderBy: { [order.data]: direction.data },
                })
            )
        }
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'GET, POST')
            return void res.status(405).json({ error: 'Method not allowed' })
        }
        const parsed = ReviewCreate.safeParse(req.body)
        if (
            !parsed.success ||
            !matchesViewer(parsed.data.reviewer, {
                id: session.user.userId,
                email: session.user.email,
            })
        )
            return void res.status(400).json({ error: 'Invalid review' })
        const { id, title, review, rating, movie } = parsed.data
        return void res.status(201).json(
            await prisma.userReview.create({
                data: {
                    id,
                    title,
                    review: reviewHtml(review),
                    rating,
                    movie: visitorMovieRelation(movie),
                    reviewer: { connect: { id: session.user.userId } },
                },
            })
        )
    } catch {
        return void res.status(400).json({ error: 'Could not save review' })
    }
}

export default withVisitorGuard(handler)
