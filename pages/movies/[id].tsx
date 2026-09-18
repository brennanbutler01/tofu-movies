import { serializePage } from 'utils/serializePage'
import { Backdrop } from '@/components/movieDetail/Backdrop'
import { MovieDetailFooter } from '@/components/movieDetail/MovieDetailFooter'
import { MovieHeader } from '@/components/movieDetail/MovieHeader'
import { ProviderAccordion } from '@/components/movieDetail/ProviderAccordion'

import { ReviewCarousel } from '@/components/movieReviews/ReviewCarousel'
import { PageWrapper } from '@/components/PageWrapper'
import { IConfig, getImageUrl } from 'pages/api/config'
import { Box, Center, Stack } from '@mantine/core'
import { IMovieDetail, getMovieDetails } from 'pages/api/movieDetails/[id]'
import { getCredits, ICreditAPIResponse } from 'pages/api/credits/[id]'
import { getOmdb, IOmdbResponse } from 'pages/api/omdb/[id]'
import RecommendationCarousel from '@/components/movieDetail/RecommendationCarousel'
import {
    IProviderResult,
    getWatchProviders,
} from 'pages/api/watchProviders/[id]'
import {
    IRecommendationResult,
    getRecommendations,
} from 'pages/api/recommendations'
import { GetServerSideProps } from 'next'
import { IMovieResponse } from 'pages/api/search/[...params]'
import { getTrending } from 'pages/api/trending/[page]'
import {
    mergeWithoutDuplicates,
    prepareStringForMerge,
} from 'utils/mergeWithoutDuplicates'
import { useIntersection } from '@mantine/hooks'
import React, { useRef } from 'react'
import TopHalfMovieDetail from '@/components/movieDetail/TopHalfMovieDetail'
import { MutableRef } from 'preact/hooks'

export interface FullMovie {
    fullMovie: IMovieDetail | void
    watchProviders: IProviderResult | void
    config?: IConfig
    credits: ICreditAPIResponse | void
    omdbResult: IOmdbResponse | void
    recommendations: IRecommendationResult[]
    trending: IMovieResponse
}

const CastCrewCarousel = React.lazy(
    () => import('@/components/movieDetail/CastCrewCarousel')
)

const TrendingCarousel = React.lazy(
    () => import('@/components/trending/TrendingCarousel')
)
export const buildGenreArray = (
    fullMovie: FullMovie['fullMovie'],
    omdbResult: FullMovie['omdbResult']
) => {
    if (fullMovie && fullMovie?.genres && omdbResult && omdbResult?.Genre) {
        return mergeWithoutDuplicates(
            fullMovie?.genres?.map(g => g?.name || ''),
            prepareStringForMerge(omdbResult?.Genre)
        )
    } else if (fullMovie && fullMovie?.genres) {
        return fullMovie?.genres?.map(g => g?.name || '')
    } else if (omdbResult && omdbResult?.Genre) {
        return prepareStringForMerge(omdbResult?.Genre)
    }
    return ['']
}

const Movies = ({
    fullMovie,
    watchProviders,
    config,
    credits,
    omdbResult,
    recommendations,
    trending,
}: FullMovie) => {
    const castCrewContainerRef = useRef<HTMLDivElement>()
    const { ref: castCrewRef, entry } = useIntersection({
        root: castCrewContainerRef.current,
        threshold: 1,
    })
    const recommendationContainerRef = useRef<HTMLDivElement>()
    const { ref: recommendationRef, entry: recommendationEntry } =
        useIntersection({
            root: recommendationContainerRef.current,
            threshold: 1,
        })
    const trendingCarouselContainerRef = useRef<HTMLDivElement>()
    const { ref: trendingRef, entry: trendingEntry } = useIntersection({
        root: trendingCarouselContainerRef.current,
        threshold: 1,
    })

    return (
        <PageWrapper title={`${fullMovie?.title} | tofu.movies`}>
            {fullMovie ? (
                <Box
                    sx={{
                        position: 'relative',
                    }}
                >
                    <Backdrop
                        fullMovie={fullMovie}
                        config={config}
                        omdbResult={omdbResult}
                    >
                        <Stack p='xl'>
                            <MovieHeader fullMovie={fullMovie} />
                            <TopHalfMovieDetail
                                fullMovie={fullMovie}
                                omdbResult={omdbResult}
                                config={config}
                            />
                            <Center>
                                <ProviderAccordion
                                    watchProviders={watchProviders}
                                    config={config}
                                />
                            </Center>
                            <div
                                ref={
                                    castCrewContainerRef as MutableRef<HTMLDivElement>
                                }
                            >
                                <div ref={castCrewRef}>
                                    {entry?.isIntersecting ? (
                                        <React.Suspense>
                                            <CastCrewCarousel
                                                type={'cast'}
                                                credits={credits}
                                                config={config}
                                            />
                                            <CastCrewCarousel
                                                config={config}
                                                credits={credits}
                                                type='crew'
                                            />
                                        </React.Suspense>
                                    ) : null}
                                </div>
                            </div>
                            {fullMovie?.id && (
                                <ReviewCarousel tmdb_id={fullMovie.id} />
                            )}
                            <div
                                ref={
                                    recommendationContainerRef as MutableRef<HTMLDivElement>
                                }
                            >
                                <div ref={recommendationRef}>
                                    {recommendationEntry?.isIntersecting ? (
                                        <React.Suspense>
                                            <RecommendationCarousel
                                                config={config}
                                                recommendations={
                                                    recommendations
                                                }
                                            />
                                        </React.Suspense>
                                    ) : null}
                                </div>
                            </div>

                            {config && trending && (
                                <div
                                    ref={
                                        trendingCarouselContainerRef as MutableRef<HTMLDivElement>
                                    }
                                >
                                    <div ref={trendingRef}>
                                        {trendingEntry?.isIntersecting ? (
                                            <React.Suspense>
                                                <TrendingCarousel
                                                    trending={trending?.results}
                                                    config={config}
                                                />
                                            </React.Suspense>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            <MovieDetailFooter
                                fullMovie={fullMovie}
                                omdbResult={omdbResult}
                            />
                        </Stack>
                    </Backdrop>
                </Box>
            ) : (
                <div>Error Getting Movie</div>
            )}
        </PageWrapper>
    )
}

export default Movies

export const getServerSideProps: GetServerSideProps = async ctx => {
    const id = parseInt(ctx.query.id as string)
    const [fullMovie, watchProviders, imageUrlConfig, movieCredits, trending] =
        await Promise.all([
            getMovieDetails(id),
            getWatchProviders(id),
            getImageUrl(),
            getCredits(id),
            getTrending(),
        ])

    let omdbResult = null

    if (fullMovie?.imdb_id) {
        omdbResult = await getOmdb(fullMovie?.imdb_id)
    }

    const recommendations = await getRecommendations(id)

    return {
        props: serializePage({
            fullMovie,
            watchProviders,
            config: imageUrlConfig,
            credits: movieCredits,
            omdbResult,
            recommendations,
            trending,
        }),
    }
}
