import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { BiDislike, BiLike } from 'react-icons/bi'
import { useReviewCRUD } from 'userReviews/useReviewCRUD'
import { useReviewSWR } from 'userReviews/useReviewSWR'
import { ReviewOrderBy } from '../ReviewOrderBySelect'
import { Prisma } from '@prisma/client'
import { useState } from 'react'

interface IUseLikeDislike {
    reviewId: string
}

export const useLikeDislike = ({ reviewId }: IUseLikeDislike) => {
    const { likeDislikeReview } = useReviewCRUD()
    const [loading, setLoading] = useState(false)
    const { query } = useRouter()
    const orderBy = (query?.orderBy as ReviewOrderBy) || ReviewOrderBy.CREATED
    const sortOrder =
        (query?.sortOrder as Prisma.SortOrder) || Prisma.SortOrder.desc

    const likeReview = async () => {
        setLoading(true)
        try {
            await likeDislikeReview(reviewId, 'LIKE', orderBy, sortOrder)
        } catch {
            showNotification({
                color: 'red',
                message: 'Could not save your reaction. Please retry.',
            })
        } finally {
            setLoading(false)
        }
    }

    const dislikeReview = async () => {
        setLoading(true)
        try {
            await likeDislikeReview(reviewId, 'DISLIKE', orderBy, sortOrder)
        } catch {
            showNotification({
                color: 'red',
                message: 'Could not save your reaction. Please retry.',
            })
        } finally {
            setLoading(false)
        }
    }

    const { data: swrReviews } = useReviewSWR({})

    const thisReview = swrReviews?.find(review => review.id === reviewId)

    const likeDislikeSum = thisReview?.likesDislikes?.reduce(
        (acc, curr) => {
            if (curr?.action === 'LIKE') {
                return { dislikes: acc.dislikes, likes: acc.likes + 1 }
            } else {
                return { likes: acc.likes, dislikes: acc.dislikes + 1 }
            }
        },
        { likes: 0, dislikes: 0 }
    )

    const actionsConfig = {
        likes: {
            buttonColor: 'blue',
            badgeColor: 'cyan',
            icon: <BiLike size={22} />,
            onClick: likeReview,
            value: likeDislikeSum?.likes || 0,
            loading,
        },
        dislikes: {
            buttonColor: 'red',
            badgeColor: 'pink',
            icon: <BiDislike size={22} />,
            onClick: dislikeReview,
            value: likeDislikeSum?.dislikes || 0,
            loading,
        },
    }

    return {
        actionsConfig,
    }
}
