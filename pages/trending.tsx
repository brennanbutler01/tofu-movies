import { serializePage } from 'utils/serializePage'
import { PageWrapper } from '@/components/PageWrapper'
import { MovieResultItem } from '@/components/search/MovieResultItem'
import { Group, Pagination, SimpleGrid, Stack, Title } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { getImageUrl, IConfig } from './api/config'
import { IMovieResponse } from './api/search/[...params]'
import { getTrending } from './api/trending/[page]'

interface ITrending {
    trending?: IMovieResponse
    config: IConfig
}
const Trending = ({ trending, config }: ITrending) => {
    const [page, setPage] = useState(1)
    const [data, setData] = useState<IMovieResponse['results']>(
        trending?.results || []
    )

    useEffect(() => {
        const getData = async () =>
            await axios.get<IMovieResponse>('/api/trending/' + page)
        getData().then(res => setData(res.data.results))
    }, [page])

    return (
        <PageWrapper title={`Trending | tofu.movies`}>
            <Stack>
                <Title>Trending</Title>
                <SimpleGrid
                    spacing='xl'
                    breakpoints={[
                        { minWidth: 'xs', cols: 2 },
                        { minWidth: 'md', cols: 3 },
                        { minWidth: 'lg', cols: 4 },
                        { minWidth: 'xl', cols: 5 },
                        { minWidth: 1600, cols: 6 },
                        { minWidth: 2000, cols: 7 },
                        { minWidth: 2400, cols: 8 },
                        { minWidth: 2800, cols: 9 },
                    ]}
                >
                    {data?.length > 0 &&
                        data?.map(movie => (
                            <MovieResultItem
                                config={config}
                                resultItem={movie}
                                key={movie.id}
                            />
                        ))}
                </SimpleGrid>
                <Group position='right'>
                    <Pagination
                        total={trending?.total_pages || 1}
                        page={page}
                        onChange={setPage}
                    />
                </Group>
            </Stack>
        </PageWrapper>
    )
}

export default Trending

export const getServerSideProps = async () => {
    const [trending, config] = await Promise.all([getTrending(), getImageUrl()])
    return { props: serializePage({ trending, config }) }
}
