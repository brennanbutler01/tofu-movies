import { serializePage } from 'utils/serializePage'
import { Skeleton, Stack } from '@mantine/core'
import { PageWrapper } from '@/components/PageWrapper'
import { ListCarousel } from '@/components/movieCarousel/ListCarousel'
import { useMovieListsSWR } from 'movieLists/useMovieListsSWR'
import React, { useRef } from 'react'
import { useSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import { getUserMovieLists, FullMovieList } from './api/movieLists'
import { IConfig, getImageUrl } from './api/config'
import { IMovieResponse } from './api/search/[...params]'
import { getTrending } from './api/trending/[page]'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { useIntersection } from '@mantine/hooks'
import { MutableRef } from 'preact/hooks'

interface IIndex {
    trending?: IMovieResponse
    movieLists?: FullMovieList[]
    config?: IConfig
}

const TrendingCarousel = React.lazy(
    () => import('@/components/trending/TrendingCarousel')
)
const HeroImage = React.lazy(() => import('@/components/HeroImage'))
const MovieListCarousel = React.lazy(
    () => import('@/components/movieLists/MovieListCarousel')
)
const IndexPage = ({ trending, movieLists, config }: IIndex) => {
    const { status } = useSession()

    const { data: swrMovieLists } = useMovieListsSWR({
        fallbackData: movieLists,
    })
    const carouselLists = swrMovieLists?.reduce<React.ReactElement[]>(
        (acc, curr) =>
            curr?.movies?.length > 0
                ? [...acc, <ListCarousel list={curr} key={curr.id} />]
                : acc,
        []
    )

    const trendingContainerRef = useRef<HTMLDivElement>()
    const { entry, ref } = useIntersection({
        root: trendingContainerRef.current,
        threshold: 1,
    })
    const heroContainerRef = useRef<HTMLDivElement>()
    const { entry: heroEntry, ref: heroRef } = useIntersection({
        root: heroContainerRef.current,
        threshold: 1,
    })
    const movieListsContainerRef = useRef<HTMLDivElement>()
    const { entry: movieListsEntry, ref: movieListsRef } = useIntersection({
        root: movieListsContainerRef.current,
        threshold: 1,
    })
    return (
        <PageWrapper title={'Home | tofu.movies'}>
            <div ref={heroContainerRef as MutableRef<HTMLDivElement>}>
                <div ref={heroRef}>
                    {heroEntry?.isIntersecting ? (
                        <React.Suspense>
                            <HeroImage />
                        </React.Suspense>
                    ) : null}
                </div>
            </div>
            <Stack p='xl'>
                {config && trending?.results && (
                    <div
                        ref={trendingContainerRef as MutableRef<HTMLDivElement>}
                    >
                        <div ref={ref}>
                            {entry?.isIntersecting ? (
                                <React.Suspense>
                                    <TrendingCarousel
                                        config={config}
                                        trending={trending?.results}
                                    />
                                </React.Suspense>
                            ) : null}
                        </div>
                    </div>
                )}
                {config && movieLists && status === 'authenticated' && (
                    <div
                        ref={
                            movieListsContainerRef as MutableRef<HTMLDivElement>
                        }
                    >
                        <div ref={movieListsRef}>
                            {movieListsEntry?.isIntersecting ? (
                                <React.Suspense>
                                    <MovieListCarousel />
                                </React.Suspense>
                            ) : null}
                        </div>
                    </div>
                )}
                {status === 'authenticated' && (
                    <Skeleton visible={!swrMovieLists} height={'100%'}>
                        {carouselLists}
                    </Skeleton>
                )}
            </Stack>
        </PageWrapper>
    )
}

export default IndexPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const [trending, movieLists, config] = await Promise.all([
        getTrending(),
        getUserMovieLists(session?.user?.email as string),
        getImageUrl(),
    ])

    return {
        props: serializePage({
            trending,
            movieLists,
            config,
        }),
    }
}
