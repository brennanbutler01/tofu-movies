import { Accordion } from '@mantine/core'
import { Prisma } from '@prisma/client'
import { ReviewWithMovie } from 'pages/api/reviews'
import React, { useCallback, useEffect, useState } from 'react'
import { useReviewSWR } from 'userReviews/useReviewSWR'
import { ReviewMovieSelect } from './ReviewMovieSelect'
import { ReviewOrderBy, ReviewOrderBySelect } from './ReviewOrderBySelect'
import { HiOutlineFilter } from 'react-icons/hi'
import { useRouter } from 'next/router'

interface IReviewFilter {
    setFilteredReviews: React.Dispatch<React.SetStateAction<ReviewWithMovie[]>>
}

export const ReviewFilter = ({ setFilteredReviews }: IReviewFilter) => {
    const [movieValues, setMovieValues] = useState<string[]>([])
    const [orderBy, setOrderBy] = useState<ReviewOrderBy>(ReviewOrderBy.CREATED)
    const [sortOrder, setSortOrder] = useState<Prisma.SortOrder>('desc')
    const { data: reviews } = useReviewSWR({ orderBy, sortOrder })

    const { query, push } = useRouter()

    const reviewsForFilteredMovies = useCallback(
        (review: ReviewWithMovie) =>
            movieValues?.find(title => title === review.movie.title),
        [movieValues]
    )

    useEffect(() => {
        if (!query.orderBy || !query.sortOrder) {
            push({ pathname: '/reviews', query: { orderBy, sortOrder } }).then(
                res => console.log(res)
            )
        }
    }, [query, push, orderBy, sortOrder])

    useEffect(() => {
        if (movieValues?.length > 0) {
            setFilteredReviews(reviews?.filter(reviewsForFilteredMovies))
        } else {
            setFilteredReviews(reviews)
        }
    }, [movieValues, reviews, reviewsForFilteredMovies, setFilteredReviews])

    return (
        <Accordion>
            <Accordion.Item value='filters'>
                <Accordion.Control icon={<HiOutlineFilter size={20} />}>
                    Review Filters
                </Accordion.Control>
                <Accordion.Panel>
                    <ReviewMovieSelect
                        setValues={setMovieValues}
                        values={movieValues}
                    />
                    <ReviewOrderBySelect
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
