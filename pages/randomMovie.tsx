import { PageWrapper } from '@/components/PageWrapper'
import {
    Box,
    Button,
    Card,
    Container,
    Group,
    LoadingOverlay,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { useImageConfigSWR } from 'imageConfig/useImageConfigSWR'
import { useState } from 'react'
import { RandomMovieActions } from '@/components/randomMovies/RandomMovieActions'
import { RandomMovieDetails } from '@/components/randomMovies/RandomMovieDetails'
import { BiRefresh } from 'react-icons/bi'
import { RandomMovieDataSource } from '@/components/randomMovies/RandomMovieDataSource'
import { useRandomMovieData } from '@/components/randomMovies/useRandomMovieData'
import { RandomMovieBreadcrumbs } from '@/components/randomMovies/RandomMovieBreadcrumbs'

export type RandomMovieSources = 'all' | 'lists' | 'providers'

const RandomMovie = () => {
    const config = useImageConfigSWR()

    const [segmentedValue, setSegmentedValue] =
        useState<RandomMovieSources>('all')
    const [imdbRating, setImdbRating] = useState<number | undefined>(0.0)
    const [filterByIMDB, setFilterByIMDB] = useState(false)
    const [movieLists, setMovieLists] = useState<string[]>([])

    const {
        loading,
        fullMovie,
        watchProviders,
        omdbDetails,
        movieFetchFunction,
    } = useRandomMovieData({ imdbRating, segmentedValue, movieLists })

    return (
        <PageWrapper authRequired title={`Random Movie | tofu.movies`}>
            <Stack>
                <RandomMovieBreadcrumbs />
                <Box>
                    <Title>
                        Generate a{' '}
                        <Text
                            span
                            sx={theme => ({
                                background: theme.fn.gradient({
                                    from: theme.colors.pink[8],
                                    to: theme.colors.grape[8],
                                    deg: 45,
                                }),
                                display: 'inline-block',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            })}
                        >
                            random
                        </Text>{' '}
                        movie
                    </Title>
                    <Text color='dimmed'>Find the next thing to watch!</Text>
                </Box>
                <Container p='xl'>
                    <Card withBorder radius='lg' shadow='md'>
                        <Box sx={{ position: 'relative' }}>
                            <LoadingOverlay visible={loading} />
                            <Group align={'center'} mb='lg' position='apart'>
                                <Title order={2}>Movie Suggestion</Title>
                                {fullMovie && (
                                    <RandomMovieActions
                                        fullMovie={fullMovie}
                                        watchProviders={watchProviders}
                                        config={config}
                                        getRandomMovie={movieFetchFunction}
                                        omdbDetails={omdbDetails}
                                    />
                                )}
                                <RandomMovieDataSource
                                    segmentedValue={segmentedValue}
                                    setSegmentedValue={setSegmentedValue}
                                    filterByIMDB={filterByIMDB}
                                    setFilterByIMDB={setFilterByIMDB}
                                    imdbRating={imdbRating}
                                    setImdbRating={setImdbRating}
                                    setMovieLists={setMovieLists}
                                    movieLists={movieLists}
                                />
                            </Group>
                            {fullMovie && (
                                <RandomMovieDetails
                                    movieDetails={fullMovie}
                                    omdbDetails={omdbDetails}
                                    config={config}
                                />
                            )}
                            {!fullMovie && (
                                <Stack>
                                    <Text color={'dimmed'}>
                                        Discover new movies and build out your
                                        watchlist.
                                    </Text>
                                    <Text color={'dimmed'}>
                                        Click below to fetch a random movie from
                                        the database.
                                    </Text>
                                    <Button
                                        leftIcon={<BiRefresh />}
                                        variant={'light'}
                                        onClick={() => movieFetchFunction()}
                                    >
                                        Fetch a random movie
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    </Card>
                </Container>
            </Stack>
        </PageWrapper>
    )
}

export default RandomMovie
