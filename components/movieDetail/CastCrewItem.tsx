// noinspection JSUnusedGlobalSymbols

import { Carousel } from '@mantine/carousel'
import React, { useRef } from 'react'
import { CastOrCrew } from '../../pages/api/credits/[id]'
import { IConfig } from '../../pages/api/config'
import { useIntersection } from '@mantine/hooks'
import { MutableRef } from 'preact/hooks'

export interface CastCrewItemProps {
    castCrew: CastOrCrew
    config: IConfig
}

const CastCrewItemDetail = React.lazy(
    () => import('@/components/movieDetail/CastCrewItemDetail')
)
const CastCrewItem = ({ castCrew, config }: CastCrewItemProps) => {
    const containerRef = useRef<HTMLDivElement>()
    const { ref, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
    })
    return (
        <Carousel.Slide key={castCrew?.name}>
            <div ref={containerRef as MutableRef<HTMLDivElement>}>
                <div ref={ref}>
                    {entry?.isIntersecting ? (
                        <React.Suspense>
                            <CastCrewItemDetail
                                castCrew={castCrew}
                                config={config}
                            />
                        </React.Suspense>
                    ) : null}
                </div>
            </div>
        </Carousel.Slide>
    )
}
export default CastCrewItem
