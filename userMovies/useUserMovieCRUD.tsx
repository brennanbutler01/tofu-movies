import { useUserMovieSWR } from './useUserMovieSWR'
import { useSession } from 'next-auth/react'
import { Prisma } from '@prisma/client'
import { v4 as uuid } from 'uuid'
import { useSWRConfig } from 'swr'
import axios from 'axios'
import { showNotification } from '@mantine/notifications'
import { BiCheck } from 'react-icons/bi'
import { useMovieSWR } from 'movies/useMovieSWR'
import { useMovieListsSWR } from 'movieLists/useMovieListsSWR'
import { MovieListTitles } from '@/components/search/MovieListMenu'
import { useMovieCRUD } from 'movies/useMovieCRUD'

interface ICreateUserMovie {
    tmdb_id: number
    seen?: boolean
}

interface IUpdateUserMovie {
    userMovieId: string
    seen: boolean
}

export const useUserMovieCRUD = () => {
    const movies = useMovieSWR({})
    const userMovies = useUserMovieSWR({})
    const { data: movieLists } = useMovieListsSWR({})
    const { data } = useSession()
    const { mutate } = useSWRConfig()
    const session = useSession()
    const { createDbMovie } = useMovieCRUD()

    const createUserMovie = async ({
        tmdb_id,
        seen = false,
    }: ICreateUserMovie) => {
        const thisMovie = movies?.find(movie => movie.tmdb_id === tmdb_id)

        const create = await createDbMovie(tmdb_id, false)
        const prismaNewMovie: Prisma.UserMovieUpdateInput = {
            movie: {
                [!thisMovie ? 'connectOrCreate' : 'connect']: !thisMovie
                    ? {
                          create: create?.create as Prisma.MovieCreateInput,
                          where: {
                              tmdb_id,
                          },
                      }
                    : { tmdb_id },
            },
            user: { connect: { id: data?.user?.userId } },
        }

        const newMovie = {
            id: uuid(),
            seen,
        }

        const optimisticData = [
            ...userMovies,
            {
                ...newMovie,
                movieId: thisMovie?.id || create?.mutate?.id,
                userId: session?.data?.user?.userId,
            },
        ]

        console.log('optimistic user movies', optimisticData)

        await Promise.all([
            mutate(
                '/api/userMovies',
                axios
                    .post('/api/userMovies', { ...prismaNewMovie, ...newMovie })
                    .then(() => {
                        showNotification({
                            color: 'teal',
                            icon: <BiCheck />,
                            message: 'User Movie Created!',
                        })
                        return optimisticData
                    }),
                {
                    rollbackOnError: true,
                    optimisticData,
                }
            ),
            mutate('/api/movies', [...movies, create?.mutate], {
                optimisticData: [...movies, create?.mutate],
                revalidate: false,
            }),
        ])

        console.log(
            'new movies',
            userMovies?.find(
                movie => movie.movieId === (thisMovie?.id || create?.create?.id)
            ),
            thisMovie?.title || create?.create?.title
        )
    }

    const updateUserMovie = async ({ userMovieId, seen }: IUpdateUserMovie) => {
        console.log('update', seen)
        const prismaUpdateMovie = {
            id: userMovieId,
            seen,
        }

        const optimisticData = userMovies?.map(movie =>
            movie.id === userMovieId ? { ...movie, seen } : movie
        )

        const thisUserMovie = userMovies?.find(
            movie => movie.id === userMovieId
        )

        const watchList = movieLists?.find(
            list => list.title === MovieListTitles.Watchlist
        )

        watchList?.movies.find(m => m.id === thisUserMovie?.movieId)

        await mutate(
            '/api/userMovies',
            axios
                .put('/api/userMovies/' + userMovieId, prismaUpdateMovie)
                .then(() => {
                    showNotification({
                        color: 'teal',
                        icon: <BiCheck />,
                        message: 'User Movie Updated!',
                    })
                    return optimisticData
                }),
            {
                rollbackOnError: true,
                optimisticData,
            }
        )
    }

    return { createUserMovie, updateUserMovie }
}
