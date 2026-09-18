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
        const hasUserMovie = swrMovies?.find(movie => movie.tmdb_id === tmdb_id)

        const create = await createDbMovie(tmdb_id, false)
            ?.then(res => res)
            .catch(console.error)

        showNotification({
            message: hasUserMovie
                ? 'Has the movie...'
                : 'Dont have the movie already and need to create it - this may take a second',
            color: hasUserMovie ? 'green' : 'orange',
            icon: hasUserMovie ? <BiLike /> : <BiAlarmExclamation />,
        })
        const movieProps: Prisma.MovieCreateNestedOneWithoutReviewsInput =
            hasUserMovie
                ? { connect: { tmdb_id } }
                : { create: create?.create as Prisma.MovieCreateInput }
        const newReview: Prisma.UserReviewCreateInput = {
            id: uuid(),
            ...formValues,
            reviewer: {
                connect: {
                    id: session?.user?.userId,
                },
            },
            movie: movieProps,
        }

        const options = {
            optimisticData: [
                {
                    ...newReview,
                    reviewer: session?.user,
                    reviewerId: session?.user?.userId,
                    movie: hasUserMovie || create?.mutate,
                },
                ...swrReviews,
            ],
        }

        console.log('these are our mutators - ', create?.mutate)
        await Promise.all([
            mutate(
                url,
                axios.post(url, newReview).then(() => {
                    showNotification({
                        message: 'Review added successfully',
                        icon: <BiCheckCircle />,
                        color: 'teal',
                    })
                    return options.optimisticData
                }),
                options
            ),
            !hasUserMovie &&
                mutate('/api/movies', [...swrMovies, create?.mutate], {
                    revalidate: false,
                }),
        ])
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

            console.log('mutate reviews', mutateReviews)

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
