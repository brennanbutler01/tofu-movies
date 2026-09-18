import { MultiSelect } from '@mantine/core'
import React from 'react'
import { useReviewSWR } from 'userReviews/useReviewSWR'

interface IReviewMovieSelect {
    values: string[]
    setValues: React.Dispatch<React.SetStateAction<string[]>>
}

export const ReviewMovieSelect = ({
    values,
    setValues,
}: IReviewMovieSelect) => {
    const { data: swrReviews } = useReviewSWR({})
    const movieTitles =
        swrReviews?.length > 0
            ? Array.from(new Set(swrReviews?.map(r => r.movie.title || '')))
            : []

    return (
        <MultiSelect
            withinPortal
            size={'xl'}
            data={movieTitles}
            label='Include reviews for these movies: '
            placeholder='Top Gun, Tim... '
            searchable={values?.length !== movieTitles?.length}
            nothingFound='No movie found'
            clearable
            clearButtonLabel='Clear movie select'
            value={values}
            transition='pop-top-left'
            transitionDuration={150}
            transitionTimingFunction='ease'
            onChange={setValues}
        />
    )
}
