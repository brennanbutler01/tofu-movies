import { MediaQuery, Grid, Stack, Text, Group, Badge } from '@mantine/core'
import dayjs from 'dayjs'
import { buildGenreArray, FullMovie } from 'pages/movies/[id]'
import { renderCountryFlag } from 'utils/renderCountryFlag'
import { minutesToHours } from 'utils/runtime'

export const MovieDetailFooter = ({
    fullMovie,
    omdbResult,
}: Pick<FullMovie, 'fullMovie' | 'omdbResult'>) => {
    return (
        <>
            {fullMovie && (
                <>
                    <MediaQuery largerThan={'md'} styles={{ display: 'none' }}>
                        <Text
                            px='xl'
                            size='xl'
                            transform='uppercase'
                            weight={900}
                        >
                            About {fullMovie.title}
                        </Text>
                    </MediaQuery>
                    <Grid justify={'center'} p='xl' gutter={'xl'}>
                        <Grid.Col sm={6} md={4} lg={3}>
                            <Stack>
                                <MediaQuery
                                    smallerThan={'md'}
                                    styles={{ display: 'none' }}
                                >
                                    <Text
                                        size='xl'
                                        transform='uppercase'
                                        weight={900}
                                    >
                                        About {fullMovie.title}
                                    </Text>
                                </MediaQuery>
                                <Text size={'xl'} weight={700}>
                                    {fullMovie.title} Overview
                                </Text>
                                {fullMovie?.original_title && (
                                    <Group>
                                        <Text color='dimmed' span>
                                            Original Title:
                                        </Text>
                                        <Text span>
                                            {fullMovie?.original_title}
                                        </Text>
                                    </Group>
                                )}
                                <Text size='sm' style={{ maxWidth: '350px' }}>
                                    {fullMovie.overview}
                                </Text>
                                {omdbResult?.Rated && (
                                    <Group>
                                        <Text color='dimmed' span>
                                            Age Rating:{' '}
                                        </Text>
                                        <Text span>
                                            {fullMovie?.adult ? 'Adult' : ''}{' '}
                                            {omdbResult?.Rated}
                                        </Text>
                                    </Group>
                                )}
                                {fullMovie?.runtime && (
                                    <Group>
                                        <Text color='dimmed'>Runtime:</Text>
                                        <Text>
                                            {minutesToHours(
                                                fullMovie.runtime || 0
                                            )}
                                        </Text>
                                    </Group>
                                )}
                            </Stack>
                        </Grid.Col>
                        <Grid.Col sm={6} md={4} lg={3}>
                            <Stack>
                                <Text size='xl' weight={700}>
                                    Extra Information
                                </Text>
                                <Group>
                                    <Text color='dimmed' span>
                                        Related Genres:
                                    </Text>
                                    <Group>
                                        {buildGenreArray(
                                            fullMovie,
                                            omdbResult
                                        ).map(genre => (
                                            <Badge key={genre}>{genre}</Badge>
                                        ))}
                                    </Group>
                                </Group>
                                {omdbResult?.Country && (
                                    <Group>
                                        <Text color='dimmed' span>
                                            Country of origin:
                                        </Text>
                                        {omdbResult?.Country?.includes(',') ? (
                                            <Group>
                                                {omdbResult?.Country?.split(
                                                    ','
                                                ).map(country => (
                                                    <Group noWrap key={country}>
                                                        {renderCountryFlag(
                                                            country
                                                        )}
                                                        <Text span>
                                                            {country}
                                                        </Text>
                                                    </Group>
                                                ))}
                                            </Group>
                                        ) : (
                                            <>
                                                {renderCountryFlag(
                                                    omdbResult?.Country
                                                )}
                                                <Text span>
                                                    {omdbResult?.Country}
                                                </Text>{' '}
                                            </>
                                        )}
                                    </Group>
                                )}
                                {fullMovie?.release_date && (
                                    <Group>
                                        <Text color='dimmed' span>
                                            Original Release Date:
                                        </Text>
                                        <Text>
                                            {dayjs(
                                                fullMovie?.release_date
                                            ).format('MM-DD-YYYY')}
                                        </Text>
                                    </Group>
                                )}
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </>
            )}
        </>
    )
}
