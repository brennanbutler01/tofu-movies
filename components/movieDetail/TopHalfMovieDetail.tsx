import {
    Container,
    Card,
    Stack,
    Title,
    Text,
    createStyles,
    Image,
    Group,
    Grid,
    Box,
} from '@mantine/core'
import dayjs from 'dayjs'
import { IConfig } from 'pages/api/config'
import { IMovieDetail } from 'pages/api/movieDetails/[id]'
import { IOmdbResponse } from 'pages/api/omdb/[id]'
import { CreditsTable } from './CreditsTable'
import { DetailBadges } from './DetailBadges'
import { DetailButtons } from './DetailButtons'
import { MovieActionButtons } from './MovieActionButtons'
import { MovieRatings } from './MovieRatings'
import { useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import { MutableRef } from 'preact/hooks'

export interface ITopHalfMovieDetail {
    fullMovie: IMovieDetail
    omdbResult?: IOmdbResponse | void
    config?: IConfig
}

const useStyles = createStyles((_, _params) => ({
    transparent: {
        background: 'transparent',
    },
}))

const TopHalfMovieDetail = ({
    fullMovie,
    omdbResult,
    config,
}: ITopHalfMovieDetail) => {
    const { classes } = useStyles()
    const containerRef = useRef<HTMLDivElement>()
    const { ref, entry } = useIntersection({
        threshold: 1,
        root: containerRef.current,
    })
    return (
        <Container className={classes.transparent}>
            <Stack spacing={'xl'}>
                <Card className={classes.transparent}>
                    <Stack>
                        <Group mb={'xs'}>
                            <Title
                                sx={theme => ({
                                    color:
                                        theme.colorScheme === 'dark'
                                            ? theme.colors.lime[3]
                                            : theme.colors.lime[8],
                                })}
                            >
                                Watch
                            </Title>
                            <Title sx={{ fontWeight: 700 }}>
                                {fullMovie?.title}
                            </Title>
                        </Group>

                        <DetailBadges
                            fullMovie={fullMovie}
                            omdbResult={omdbResult}
                        />
                        <Text color={'dimmed'} size='xl'>
                            {fullMovie?.tagline}
                        </Text>
                        <DetailButtons tmdb_id={fullMovie.id as number} />
                    </Stack>
                </Card>
                <Card className={classes.transparent}>
                    <Grid gutter={'xl'}>
                        <Grid.Col md={4}>
                            <Stack align='center'>
                                <div
                                    ref={
                                        containerRef as MutableRef<HTMLDivElement>
                                    }
                                >
                                    <div ref={ref}>
                                        <Image
                                            src={
                                                entry?.isIntersecting &&
                                                fullMovie.poster_path
                                                    ? `${
                                                          config?.base_url
                                                      }/${config?.poster_sizes.at(
                                                          -1
                                                      )}${
                                                          fullMovie.poster_path
                                                      }`
                                                    : undefined
                                            }
                                            sx={{ maxWidth: '450px' }}
                                            radius='md'
                                            alt={`Poster for ${fullMovie?.title}`}
                                            withPlaceholder={
                                                !fullMovie?.poster_path
                                            }
                                            placeholder={
                                                <Box
                                                    sx={theme => ({
                                                        background:
                                                            theme.fn.gradient(
                                                                theme.other
                                                                    .errorGradient
                                                            ),
                                                        display: 'flex',
                                                        flex: 'auto',
                                                        height: '100%',
                                                        borderRadius:
                                                            theme.radius.md,
                                                    })}
                                                />
                                            }
                                        />
                                    </div>
                                </div>
                                <MovieActionButtons
                                    movie={{
                                        ...fullMovie,
                                        value: `${fullMovie?.id}`,
                                    }}
                                />
                            </Stack>
                        </Grid.Col>
                        <Grid.Col md={8} lg={7} offsetLg={1}>
                            <Stack>
                                <Group>
                                    <Title sx={{ fontWeight: 700 }}>
                                        {fullMovie?.title}{' '}
                                        {dayjs(
                                            fullMovie?.release_date
                                        )?.isValid()
                                            ? `(${dayjs(
                                                  fullMovie?.release_date
                                              )?.year()})`
                                            : ''}
                                    </Title>
                                    <MovieRatings
                                        ratings={omdbResult?.Ratings || []}
                                    />
                                </Group>
                                <DetailBadges
                                    fullMovie={fullMovie}
                                    omdbResult={omdbResult}
                                    combineGenres
                                />
                                <Text size='lg'>
                                    {omdbResult?.Plot || fullMovie?.overview}
                                </Text>
                                <CreditsTable
                                    fullMovie={fullMovie}
                                    omdbResult={omdbResult}
                                />
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Card>
            </Stack>
        </Container>
    )
}

export default TopHalfMovieDetail
