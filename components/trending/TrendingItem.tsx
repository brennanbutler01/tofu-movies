import { IMovieAPIResults } from '../../pages/api/search/[...params]'
import { Carousel } from '@mantine/carousel'
import { IConfig } from '../../pages/api/config'
import React, { useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import { MutableRef } from 'preact/hooks'

export interface TrendingItemProps {
    trending: IMovieAPIResults
    config: IConfig
}

const TrendingItemDetail = React.lazy(
    () => import('@/components/trending/TrendingItemDetail')
)
const TrendingItem = ({ trending, config }: TrendingItemProps) => {
    const containerRef = useRef<HTMLDivElement>()
    const { ref, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
    })

    return (
        <Carousel.Slide key={trending?.id}>
            <div ref={containerRef as MutableRef<HTMLDivElement>}>
                <div ref={ref}>
                    {entry?.isIntersecting ? (
                        <React.Suspense>
                            <TrendingItemDetail
                                trending={trending}
                                config={config}
                            />
                        </React.Suspense>
                    ) : null}
                </div>
            </div>
        </Carousel.Slide>
    )
}
export default TrendingItem
