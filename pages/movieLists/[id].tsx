import { ListDetailsEditor } from '@/components/movieLists/ListDetailsEditor'
import { serializePage } from 'utils/serializePage'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { PageWrapper } from '@/components/PageWrapper'
import { MovieResultItem } from '@/components/search/MovieResultItem'
import { IConfig, getImageUrl } from 'pages/api/config'
import {
    Container,
    SimpleGrid,
    Stack,
    Title,
    Text,
    Image,
    Box,
    Button,
    LoadingOverlay,
} from '@mantine/core'
import { GetServerSidePropsContext } from 'next'
import { FullMovieList } from 'pages/api/movieLists'
import { getMovieList } from 'pages/api/movieLists/[id]'
import { MovieListBreadcrumbs } from '@/components/movieLists/MovieListBreadcrumbs'
import Link from 'next/link'
import { useMovieListsSWR } from '../../movieLists/useMovieListsSWR'
import React, { useMemo } from 'react'
import { useSession } from 'next-auth/react'

interface IMovieList {
    movieList: FullMovieList
    config: IConfig
}
const MovieList = ({ movieList, config }: IMovieList) => {
    const { data: movieLists, isLoading } = useMovieListsSWR({})
    const session = useSession()
    const listItems = useMemo(
        () =>
            !movieList?.allowEdits &&
            movieList?.createdBy !== session?.data?.user?.email
                ? movieList.movies?.map(item => (
                      <MovieResultItem
                          resultItem={item}
                          config={config}
                          key={item.id}
                      />
                  ))
                : movieLists?.reduce<React.ReactNode[]>((acc, curr) => {
                      if (curr.id === movieList.id) {
                          return [
                              ...acc,
                              ...curr.movies.map(item => (
                                  <MovieResultItem
                                      resultItem={item}
                                      config={config}
                                      key={item.id}
                                  />
                              )),
                          ]
                      }
                      return acc
                  }, []),
        [session, config, movieLists, movieList]
    )
    return (
        <PageWrapper authRequired title={`${movieList?.title} | tofu.movies`}>
            <Stack>
                <MovieListBreadcrumbs />
                <Title>{movieList?.title}</Title>
                <Text>{movieList.description}</Text>
                {movieList.createdBy === session.data?.user?.email && (
                    <ListDetailsEditor list={movieList} />
                )}
                {listItems?.length > 0 ? (
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
                        {listItems}
                    </SimpleGrid>
                ) : isLoading ? (
                    <LoadingOverlay visible />
                ) : (
                    <Container>
                        <Stack>
                            <Box>
                                <Text weight={700} size='xl'>
                                    Movie List Empty!
                                </Text>
                                <Text align='center' color='dimmed'>
                                    {movieList?.allowEdits ||
                                    movieList.createdBy ===
                                        session?.data?.user?.email
                                        ? 'Search and add some movies to the list to get started!'
                                        : 'Wait for some movies to be added by the list owner.'}
                                </Text>
                            </Box>
                            <Image
                                src={'/empty-vector.png'}
                                height={320}
                                radius='lg'
                                alt='Image to display when we have no movies in the list'
                            />
                            <Link
                                legacyBehavior
                                href={{ pathname: '/search', query: { q: '' } }}
                                passHref
                            >
                                <Button variant='light' component='a'>
                                    Search for Movies
                                </Button>
                            </Link>
                        </Stack>
                    </Container>
                )}
            </Stack>
        </PageWrapper>
    )
}
export default MovieList

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    if (!session?.user?.userId || !session.user.email)
        return { redirect: { destination: '/auth/signin', permanent: false } }
    if (typeof ctx.query.id !== 'string') return { notFound: true }
    const id = ctx.query.id
    const movieList = await getMovieList(id, {
        id: session.user.userId,
        email: session.user.email,
    })

    if (!movieList) {
        return {
            notFound: true,
        }
    }

    const config = await getImageUrl()
    return {
        props: serializePage({
            movieList,
            config,
        }),
    }
}
