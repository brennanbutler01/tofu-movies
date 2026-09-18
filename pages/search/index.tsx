import { serializePage } from 'utils/serializePage'
import { PageWrapper } from '@/components/PageWrapper'
import { MovieResultItem } from '@/components/search/MovieResultItem'
import { IConfig, getImageUrl } from 'pages/api/config'
import {
    Group,
    LoadingOverlay,
    Pagination,
    SimpleGrid,
    Stack,
    Title,
} from '@mantine/core'
import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import {
    IMovieResponse,
    IMovieAPIResults,
    movieSearch,
} from 'pages/api/search/[...params]'
import { getMovies, MovieWithLists } from 'pages/api/movies'
import { useEffect, useState } from 'react'
import { useMovieSWR } from 'movies/useMovieSWR'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getUserMovies } from 'pages/api/userMovies'
import { UserMovie } from '@prisma/client'
import { useUserMovieSWR } from 'userMovies/useUserMovieSWR'
import { SearchBreadcrumbs } from '@/components/search/SearchBreadcrumbs'

interface ISearch {
    movieResults: IMovieResponse
    config: IConfig
    dbMovies: MovieWithLists[]
    userMovies: UserMovie[]
}

const Search = ({ movieResults, config, dbMovies, userMovies }: ISearch) => {
    useMovieSWR({ fallbackData: dbMovies })
    const [page, setPage] = useState(1)
    const { query } = useRouter()
    const [movies, setMovies] = useState<IMovieAPIResults[]>([])
    useUserMovieSWR({ fallbackData: userMovies })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const getPage = async () =>
            await axios.get<IMovieResponse>(`/api/search/${query.q}/${page}`)

        getPage().then(res => res && setMovies(res.data.results))
        setLoading(false)
    }, [page, query.q])

    return (
        <PageWrapper title={`Search ${query?.q} | tofu.movies`}>
            <Stack>
                <SearchBreadcrumbs />
                <Title>Search results for {query.q}</Title>
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
                    <LoadingOverlay
                        visible={!config || loading}
                        overlayBlur={2}
                    />
                    {movies.map(item => (
                        <MovieResultItem
                            key={item.id}
                            resultItem={item}
                            config={config}
                        />
                    ))}
                </SimpleGrid>
                <Group position='right'>
                    <Pagination
                        total={movieResults?.total_pages || 1}
                        page={page}
                        onChange={page => setPage(page)}
                    />
                </Group>
            </Stack>
        </PageWrapper>
    )
}
export default Search

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { q } = ctx.query
    const [movieResults, config, dbMovies, session] = await Promise.all([
        movieSearch(q as string, 1),
        getImageUrl(),
        getMovies(),
        getServerSession(ctx.req, ctx.res, authOptions),
    ])

    const userMovies = await getUserMovies(session?.user?.userId as string)

    return {
        props: serializePage({
            movieResults,
            config,
            dbMovies,
            userMovies,
        }),
    }
}
