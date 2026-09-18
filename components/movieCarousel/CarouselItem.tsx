import { Carousel } from '@mantine/carousel'
import { Movie } from '@prisma/client'
import React, { useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import { MutableRef } from 'preact/hooks'

export interface ICarouselItem {
    movie: Movie
}

const CarouselItemDetail = React.lazy(
    () => import('@/components/movieCarousel/CarouselItemDetail')
)
export const CarouselItem = ({ movie }: ICarouselItem) => {
    const containerRef = useRef<HTMLDivElement>()
    const { ref, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
    })
    return (
        <Carousel.Slide>
            <div ref={containerRef as MutableRef<HTMLDivElement>}>
                <div ref={ref}>
                    {entry?.isIntersecting ? (
                        <React.Suspense>
                            <CarouselItemDetail movie={movie} />
                        </React.Suspense>
                    ) : null}
                </div>
            </div>
        </Carousel.Slide>
    )
}
