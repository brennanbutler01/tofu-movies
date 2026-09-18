import { serializePage } from 'utils/serializePage'
import { MovieListBreadcrumbs } from '@/components/movieLists/MovieListBreadcrumbs'
import { MovieListModalTrigger } from '@/components/movieLists/MovieListModalTrigger'
import { MovieListTabs } from '@/components/movieLists/MovieListTabs'
import { PageWrapper } from '@/components/PageWrapper'
import {
    Box,
    Group,
    LoadingOverlay,
    Stack,
    TextInput,
    Title,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useMovieListsSWR } from 'movieLists/useMovieListsSWR'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { FullMovieList, getUserMovieLists } from 'pages/api/movieLists'
import { useState } from 'react'
import { BiSearch } from 'react-icons/bi'

interface IMovieLists {
    userMovieLists: FullMovieList[]
}

const MovieLists = ({ userMovieLists }: IMovieLists) => {
    const [searchValue, setSearchValue] = useState('')
    const [debounced] = useDebouncedValue(searchValue, 250)
    const { isLoading } = useMovieListsSWR({ fallbackData: userMovieLists })

    return (
        <PageWrapper authRequired title={'Watchlists | tofu.movies'}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <MovieListBreadcrumbs />
                <Group position='apart' align={'center'}>
                    <Title>Movie Lists</Title>
                    <MovieListModalTrigger fullWidth={false} />
                </Group>
                <Box sx={{ display: 'block', maxWidth: '500px' }}>
                    <TextInput
                        icon={<BiSearch />}
                        radius='md'
                        labelProps={{ size: 'lg', mb: 7 }}
                        placeholder='My List'
                        label='Search Lists'
                        onChange={e => setSearchValue(e.currentTarget.value)}
                    />
                </Box>
                <MovieListTabs search={debounced} />
            </Stack>
        </PageWrapper>
    )
}
export default MovieLists

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    let userMovieLists: FullMovieList[] = []
    if (session?.user?.email) {
        userMovieLists = await getUserMovieLists(session?.user?.email)
    }

    return {
        props: serializePage({
            userMovieLists,
        }),
    }
}
