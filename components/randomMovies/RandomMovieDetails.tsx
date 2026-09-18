import {
    Box,
    Grid,
    Image,
    Spoiler,
    Stack,
    Text,
    Title,
    useMantineTheme,
} from '@mantine/core'
import { DetailBadges } from '@/components/movieDetail/DetailBadges'
import { MovieRatings } from '@/components/movieDetail/MovieRatings'
import { useMediaQuery } from '@mantine/hooks'
import dayjs from 'dayjs'
import { IMovieDetail } from 'pages/api/movieDetails/[id]'
import { IConfig } from 'pages/api/config'
import { IOmdbResponse } from '../../pages/api/omdb/[id]'

interface IRandomMovieDetails {
    movieDetails: IMovieDetail | void
    config: IConfig | void
    omdbDetails: IOmdbResponse | void
}

export const RandomMovieDetails = ({
    movieDetails,
    config,
    omdbDetails,
}: IRandomMovieDetails) => {
    const theme = useMantineTheme()

    const matchesXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)
    const title = (
        <Title order={3}>
            {movieDetails?.title}{' '}
            {dayjs(movieDetails?.release_date)?.isValid()
                ? `(${dayjs(movieDetails?.release_date).year()})`
                : ''}
        </Title>
    )
    return (
        <Grid>
            <Grid.Col xs={12} sm={6} md={4}>
                <Stack>
                    {matchesXs && title}
                    <Image
                        src={`${config?.base_url}/${
                            config?.poster_sizes[
                                config?.poster_sizes?.length - 1
                            ]
                        }/${movieDetails?.poster_path}`}
                        radius='md'
                        withPlaceholder={!movieDetails?.poster_path}
                        alt={'Poster for ' + movieDetails?.title}
                        styles={{
                            root: {
                                minHeight: '250px',
                            },
                            imageWrapper: {
                                minHeight: '250px',
                            },
                            image: {
                                minHeight: '250px',
                            },
                            placeholder: {
                                minHeight: '250px',
                                height: '100%',
                            },
                        }}
                        placeholder={
                            <Box
                                sx={theme => ({
                                    background: theme.fn.gradient(
                                        theme.other.errorGradient
                                    ),
                                    display: 'flex',
                                    flex: 'auto',
                                    height: '100%',
                                    borderRadius: theme.radius.md,
                                })}
                            />
                        }
                    />
                </Stack>
            </Grid.Col>
            <Grid.Col xs={12} sm={6} md={8}>
                <Stack justify={'space-between'} spacing='lg'>
                    {!matchesXs && title}
                    <>
                        {movieDetails && (
                            <DetailBadges
                                fullMovie={movieDetails}
                                omdbResult={omdbDetails}
                            />
                        )}
                        {omdbDetails?.Ratings && (
                            <MovieRatings ratings={omdbDetails?.Ratings} />
                        )}
                    </>
                    <Spoiler
                        hideLabel='Hide Overview'
                        showLabel='Show Overview'
                        maxHeight={320}
                    >
                        <Text size='lg' color='dimmed'>
                            {movieDetails?.overview}
                        </Text>
                    </Spoiler>
                </Stack>
            </Grid.Col>
        </Grid>
    )
}
