import { Carousel } from '@mantine/carousel'
import { Box } from '@mantine/core'
import { FullMovieList } from '../../pages/api/movieLists'
import React, { useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import { MutableRef } from 'preact/hooks'

interface Props {
    list: FullMovieList
}

const MovieListItem = React.lazy(
    () => import('@/components/movieLists/MovieListItem')
)

const MovieListCarouselItem = ({ list }: Props) => {
    const containerRef = useRef<HTMLDivElement>()
    const { ref, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
    })
    return (
        <Carousel.Slide key={list.id}>
            <div ref={containerRef as MutableRef<HTMLDivElement>}>
                <div ref={ref}>
                    {entry?.isIntersecting ? (
                        <React.Suspense>
                            <Box
                                sx={_theme => ({
                                    '& >div': {
                                        height: '500px',
                                    },
                                })}
                            >
                                <MovieListItem
                                    tabFilter={'connected'}
                                    fullDetail={false}
                                    list={list}
                                />
                            </Box>
                        </React.Suspense>
                    ) : null}
                </div>
            </div>
        </Carousel.Slide>
    )
}

export default MovieListCarouselItem
