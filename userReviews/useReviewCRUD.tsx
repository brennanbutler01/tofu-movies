import { IReviewForm } from '@/components/movieReviews/ReviewForm'
import { showNotification } from '@mantine/notifications'
import { LikeActions, Prisma } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import {
    BiAlarmExclamation,
    BiCheck,
    BiCheckCircle,
    BiLike,
} from 'react-icons/bi'
import { useSWRConfig } from 'swr'
import { v4 as uuid } from 'uuid'
import { useReviewSWR } from './useReviewSWR'
import { useMovieCRUD } from '../movies/useMovieCRUD'
import { useMovieSWR } from 'movies/useMovieSWR'
import { ReviewOrderBy } from '@/components/movieReviews/ReviewOrderBySelect'
import { useRouter } from 'next/router'

export const useReviewCRUD = () => {
    const { mutate } = useSWRConfig()
    const { data: session } = useSession()
    const { query } = useRouter()
    const url =
        '/api/reviews?orderBy=' +
        (query?.orderBy || 'created') +
        '&sortOrder=' +
        (query?.sortOrder || 'desc')
    const { data: swrReviews } = useReviewSWR({
        orderBy: query?.orderBy as ReviewOrderBy,
        sortOrder: query?.sortOrder as Prisma.SortOrder,
    })
    const { createDbMovie } = useMovieCRUD()
    const swrMovies = useMovieSWR({})

    const createReview = async (formValues: IReviewForm, tmdb_id: number) => {
        if (!session?.user?.userId)
            throw new Error('Start a session before saving a review.')
        const existing = swrMovies?.find(movie => movie.tmdb_id === tmdb_id)
        const prepared = existing
            ? undefined
            : await createDbMovie(tmdb_id, false)
        if (!existing && !prepared)
            throw new Error('Could not load this movie. Please retry.')
        await axios.post(url, {
            id: uuid(),
            title: formValues.title,
            review: formValues.review,
            rating: formValues.rating,
            movie: existing
                ? { connect: { tmdb_id } }
                : { create: prepared?.create },
        })
        await mutate(url)
        showNotification({
            message: 'Review saved',
            color: 'teal',
            icon: <BiCheckCircle />,
        })
    }

    const likeDislikeReview = async (
        reviewId: string,
        action: LikeActions,
        orderBy: ReviewOrderBy,
        sortOrder: Prisma.SortOrder
    ) => {
        if (session?.user?.userId) {
            const mutateReviews = swrReviews?.map(r =>
                r.id === reviewId
                    ? {
                          ...r,
                          likesDislikes: [
                              ...r.likesDislikes.map(l =>
                                  l.reviewerId === session?.user?.userId
                                      ? { ...l, action }
                                      : l
                              ),
                          ],
                      }
                    : r
            )

            await mutate(
                '/api/reviews?orderBy=' + orderBy + '&sortOrder=' + sortOrder,
                axios
                    .put('/api/reviews/' + reviewId + '/reaction', { action })
                    .then(() => {
                        showNotification({
                            icon: <BiCheck />,
                            color: 'teal',
                            message: `Successfully ${
                                action === 'LIKE' ? 'liked' : 'disliked'
                            } review.`,
                        })
                        return undefined
                    }),
                {
                    rollbackOnError: true,
                    optimisticData: mutateReviews,
                }
            )
        }
    }
    return { createReview, likeDislikeReview }
}
