import { Carousel } from '@mantine/carousel'
import { IRecommendationResult } from '../../pages/api/recommendations'
import { IConfig } from '../../pages/api/config'
import React, { useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import { MutableRef } from 'preact/hooks'

const RecommendationItemDetail = React.lazy(
    () => import('@/components/movieDetail/RecommendationItemDetail')
)

const RecommendationItem = ({
    movie,
    config,
}: {
    movie: IRecommendationResult
    config: IConfig
}) => {
    const containerRef = useRef<HTMLDivElement>()
    const { ref, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
    })
    return (
        <Carousel.Slide key={movie.id}>
            <div ref={containerRef as MutableRef<HTMLDivElement>}>
                <div ref={ref}>
                    {entry?.isIntersecting ? (
                        <React.Suspense>
                            <RecommendationItemDetail
                                config={config}
                                movie={movie}
                            />
                        </React.Suspense>
                    ) : null}
                </div>
            </div>
        </Carousel.Slide>
    )
}
export default RecommendationItem
