import dayjs from '@/dayjs/index'
import { Card, Container, Text } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React, { useRef } from 'react'
import { IConfig } from 'pages/api/config'
import { MovieCardActions } from './MovieCardActions'
import Link from 'next/link'
import { Movie } from '@prisma/client'
import { IMovieAPIResults } from 'pages/api/search/[...params]'
import { useIntersection } from '@mantine/hooks'
import { MutableRef } from 'preact/hooks'

interface ISearchResultItem {
    resultItem: IMovieAPIResults | Movie
    config: IConfig
}

const MovieImage = React.lazy(() => import('../MovieImage'))

export const MovieResultItem = ({ resultItem, config }: ISearchResultItem) => {
    const { status } = useSession()
    const containerRef = useRef<HTMLDivElement>()
    const { ref, entry } = useIntersection({
        threshold: 1,
        root: containerRef.current,
    })

    return (
        <Container key={resultItem.id}>
            <Card
                radius='md'
                shadow='sm'
                p='lg'
                withBorder
                sx={{ width: '275px', minHeight: '240px' }}
            >
                <Card.Section>
                    <div ref={containerRef as MutableRef<HTMLDivElement>}>
                        <div ref={ref}>
                            {entry?.isIntersecting ? (
                                <React.Suspense>
                                    <Link
                                        legacyBehavior
                                        passHref
                                        href={'/movies/' + resultItem.id}
                                    >
                                        <a>
                                            <MovieImage
                                                src={
                                                    'poster' in resultItem
                                                        ? resultItem.poster ||
                                                          undefined
                                                        : resultItem?.poster_path
                                                        ? `${config.base_url}/${
                                                              config
                                                                  .poster_sizes[
                                                                  config
                                                                      .poster_sizes
                                                                      .length -
                                                                      1
                                                              ]
                                                          }${
                                                              resultItem.poster_path
                                                          }`
                                                        : undefined
                                                }
                                                alt={`Poster for movie ${resultItem?.title}`}
                                            />
                                        </a>
                                    </Link>
                                </React.Suspense>
                            ) : null}
                        </div>
                    </div>
                </Card.Section>
                <Card.Section inheritPadding py={'sm'}>
                    <Text size={'xl'} weight={500}>
                        {resultItem.title}{' '}
                        {resultItem.release_date && (
                            <Text span>
                                ({dayjs(resultItem.release_date).year()})
                            </Text>
                        )}
                    </Text>
                    {status === 'authenticated' && resultItem?.id && (
                        <MovieCardActions
                            tmdb_id={
                                'tmdb_id' in resultItem
                                    ? resultItem.tmdb_id
                                    : resultItem?.id
                            }
                        />
                    )}
                </Card.Section>
            </Card>
        </Container>
    )
}
