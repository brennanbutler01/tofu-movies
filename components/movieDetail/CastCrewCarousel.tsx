import { IConfig } from 'pages/api/config'
import { Carousel } from '@mantine/carousel'
import { Text, Image } from '@mantine/core'
import {
    CastOrCrew,
    ICreditAPIResponse,
    ICreditCrew,
} from 'pages/api/credits/[id]'
import React from 'react'
import { useEffect, useState } from 'react'
import { useEmbla } from 'utils/embla/useEmbla'
import { CarouselTitleControls } from '../CarouselTitleControls'
import Link from 'next/link'

interface ICastCrew {
    type: 'cast' | 'crew'
    credits: ICreditAPIResponse | void
    config: IConfig | void
}

const CastCrewCarousel = ({ type, credits, config }: ICastCrew) => {
    const { goBack, goForward, setEmbla } = useEmbla()
    const [data, setData] = useState<CastOrCrew[]>([])
    const creditData = credits?.[type]

    useEffect(() => {
        if (creditData) {
            if (type === 'crew') {
                const crewData = (creditData as ICreditCrew[])?.reduce<
                    ICreditCrew[]
                >((acc, curr) => {
                    if (curr?.name && curr?.profile_path) {
                        const hasCreditAlready = acc.find(
                            crew =>
                                crew.name === curr.name &&
                                crew.profile_path === curr.profile_path
                        )
                        if (hasCreditAlready) {
                            return [
                                ...acc.map(crew =>
                                    crew.id === hasCreditAlready.id
                                        ? {
                                              ...crew,
                                              job: `${crew.job}, ${curr.job}`,
                                          }
                                        : crew
                                ),
                            ]
                        }
                        return [...acc, curr]
                    }
                    return acc
                }, [])
                setData(crewData)
            } else {
                setData(creditData)
            }
        }
    }, [type, creditData])

    return (
        <>
            {config && credits && data?.length > 0 && (
                <>
                    <CarouselTitleControls
                        title={type === 'cast' ? 'Cast' : 'Crew'}
                        goBack={goBack}
                        goForward={goForward}
                    />
                    <Carousel
                        slideSize={'100%'}
                        withIndicators={false}
                        withControls={false}
                        height={500}
                        getEmblaApi={setEmbla}
                        align='start'
                        slideGap={'lg'}
                        breakpoints={[
                            {
                                minWidth: 'xs',
                                slideSize: '100%',
                            },
                            { minWidth: 'sm', slideSize: '33.33%' },
                            { minWidth: 'md', slideSize: '33.33%' },
                            { minWidth: 'lg', slideSize: '25%' },
                            { minWidth: 'xl', slideSize: '20%' },
                            { minWidth: 1800, slideSize: '16.2%' },
                        ]}
                    >
                        {data.map(c =>
                            c?.profile_path && c?.name ? (
                                <Carousel.Slide key={c?.name}>
                                    <Link
                                        legacyBehavior
                                        href={'/person/' + c.id}
                                        passHref
                                    >
                                        <a
                                            style={{
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <Image
                                                src={`${config.base_url}/${config.profile_sizes[2]}/${c.profile_path}`}
                                                height={400}
                                                caption={
                                                    <Text
                                                        weight={700}
                                                        size='xl'
                                                    >
                                                        {c.name} as{' '}
                                                        {'character' in c
                                                            ? c?.character
                                                            : 'job' in c
                                                            ? c?.job
                                                            : ''}
                                                    </Text>
                                                }
                                                radius='md'
                                                sx={{
                                                    ':hover': {
                                                        opacity: 0.85,
                                                    },
                                                }}
                                                alt={`Picture of person - ${c?.name}`}
                                            />
                                        </a>
                                    </Link>
                                </Carousel.Slide>
                            ) : (
                                <React.Fragment key={c.id}></React.Fragment>
                            )
                        )}
                    </Carousel>
                </>
            )}
        </>
    )
}
export default CastCrewCarousel
