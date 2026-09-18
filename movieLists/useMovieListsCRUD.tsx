import { MovieListTitles } from '@/components/search/MovieListMenu'
import { showNotification } from '@mantine/notifications'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { BiCheck } from 'react-icons/bi'
import { useSWRConfig } from 'swr'
import { ReturnTypeCreateMovie, useMovieCRUD } from 'movies/useMovieCRUD'
import { useMovieSWR } from 'movies/useMovieSWR'
import { v4 as uuid } from 'uuid'
import { useMovieListsSWR } from './useMovieListsSWR'
import { MovieList, Prisma } from '@prisma/client'
import { usePublicMovieListSWR } from './usePublicMovieListSWR'
import { BsEye } from 'react-icons/bs'
import { FullMovieList } from '../pages/api/movieLists'

export const useMovieListsCRUD = () => {
    const { mutate } = useSWRConfig()
    const { data: session } = useSession()
    const { data: swrMovieLists } = useMovieListsSWR({})
    const swrMovies = useMovieSWR({})
    const { createDbMovie } = useMovieCRUD()
    const { data: publicMovieLists } = usePublicMovieListSWR({})

    const createWatchList = async () => {
        if (
            !swrMovieLists?.find(
                list => list?.title === MovieListTitles.Watchlist
            )
        ) {
            const newWatchList: Prisma.MovieListCreateInput = {
                id: uuid(),
                title: MovieListTitles.Watchlist,
                description: 'Watchlist',
                created: new Date(),
                isPublic: false,
                updatedAt: new Date(),
                users: {
                    connect: {
                        email: session?.user?.email as string,
                    },
                },
            }

            const optimisticData = [
                { ...newWatchList, users: [session?.user] },
                ...swrMovieLists,
            ]

            await mutate(
                '/api/movieLists',
                axios.post('/api/movieLists', newWatchList).then(() => {
                    showNotification({
                        message: 'Created watchlist',
                        color: 'teal',
                        icon: <BiCheck />,
                    })
                    return optimisticData
                }),
                {
                    rollbackOnError: true,
                    optimisticData: optimisticData,
                }
            )
        }
    }

    const createMovieList = async (
        title: string,
        description = '',
        isPublic = false,
        movies = [] as number[],
        image: string,
        allowEdits: boolean
    ) => {
        if (session?.user?.email && title !== MovieListTitles.Watchlist) {
            const moviesToConnect = movies.filter(tmdb_id =>
                swrMovies?.some(movie => movie.tmdb_id === tmdb_id)
            )
            const moviesToCreate = await Promise.all([
                ...movies
                    .filter(tmdb_id =>
                        swrMovies?.every(movie => movie.tmdb_id !== tmdb_id)
                    )
                    .map(tmdb_id => createDbMovie(tmdb_id, false)),
            ])

            const prepareMovieObject = () => {
                let movieObject: Record<
                    string,
                    ({ tmdb_id: number } | Prisma.MovieCreateInput)[]
                > | null = {}
                if (movies?.length > 0) {
                    if (moviesToConnect?.length > 0) {
                        movieObject.connect = moviesToConnect?.map(tmdb_id => ({
                            tmdb_id,
                        }))
                    }
                    if (moviesToCreate?.length > 0) {
                        movieObject.create = moviesToCreate?.map(
                            m => m?.create as Prisma.MovieCreateInput
                        )
                    }
                } else {
                    movieObject = null
                }
                return movieObject
            }

            const movieProps = prepareMovieObject()

            const newMovieList: Prisma.MovieListCreateInput = {
                id: uuid(),
                title,
                created: new Date(),
                updatedAt: new Date(),
                users: {
                    connect: {
                        email: session.user.email,
                    },
                },
                image,
                description,
                isPublic,
                allowEdits,
                createdBy: session?.user?.email,
                ...(movieProps && { movies: { ...movieProps } }),
            }

            const fullConnectedMovies = moviesToConnect?.map(tmdb_id =>
                swrMovies?.find(m => m.tmdb_id === tmdb_id)
            )
            const mutatedMovies = moviesToCreate?.map(m => m?.mutate)

            const optimisticData = [
                ...swrMovieLists,
                {
                    ...newMovieList,
                    users: [session?.user],
                    movies: [...fullConnectedMovies, ...mutatedMovies],
                },
            ]

            await mutate(
                '/api/movieLists',
                axios.post('/api/movieLists', newMovieList).then(() => {
                    showNotification({
                        message: 'Movie List Added',
                        icon: <BiCheck />,
                        color: 'teal',
                    })
                    return optimisticData
                }),
                {
                    rollbackOnError: true,
                    optimisticData,
                }
            )
        }
    }

    const deleteMovieList = async (listId: string) => {
        if (session?.user?.email) {
            const thisList = swrMovieLists.find(list => list.id === listId)
            const optimisticData = swrMovieLists.filter(
                list => list.id !== listId
            )
            if (thisList?.title !== MovieListTitles.Watchlist) {
                await mutate(
                    '/api/movieLists',
                    axios.delete('/api/movieLists/' + listId).then(() => {
                        showNotification({
                            icon: <BiCheck />,
                            message: 'Movie List successfully deleted',
                            color: 'teal',
                        })
                        return optimisticData
                    }),
                    {
                        rollbackOnError: true,
                        optimisticData,
                    }
                )
            }
        }
    }

    const addMovieToList = async (listId: string, tmdb_id: number) => {
        //check to see if we have the movie already crated
        const hasMovieBeenCreated = swrMovies?.find(
            movie => movie.tmdb_id === tmdb_id
        )

        let needToCreateMovie: ReturnTypeCreateMovie | undefined = undefined

        //if we don't have the movie already, lets get it ready
        if (!hasMovieBeenCreated) {
            needToCreateMovie = await createDbMovie(tmdb_id, false)
        }

        //no movie, then create - if we do have the movie, then just connect it.
        const updatePrismaList: Prisma.MovieListUpdateInput = {
            id: listId,
            movies: needToCreateMovie
                ? { create: needToCreateMovie?.create }
                : { connect: { tmdb_id } },
        }

        const mutateList = swrMovieLists?.map(list =>
            list.id === listId
                ? {
                      ...list,
                      movies: [
                          ...list.movies,
                          hasMovieBeenCreated || needToCreateMovie?.mutate,
                      ],
                  }
                : list
        )

        await mutate(
            '/api/movieLists',
            axios
                .put('/api/movieLists/' + listId, updatePrismaList)
                .then(_res => {
                    showNotification({ message: 'Updated list' })
                    return mutateList
                }),
            {
                rollbackOnError: true,
                optimisticData: mutateList,
            }
        )
    }

    const removeMovieFromList = async (listId: string, tmdb_id: number) => {
        const updateList: Prisma.MovieListUpdateInput = {
            id: listId,
            movies: {
                disconnect: {
                    tmdb_id,
                },
            },
        }

        const optimisticData = [
            ...swrMovieLists.map(list =>
                list.id === listId
                    ? {
                          ...list,
                          movies: list.movies.filter(
                              movie => movie.tmdb_id !== tmdb_id
                          ),
                      }
                    : list
            ),
        ]

        await mutate(
            '/api/movieLists',
            axios.put('/api/movieLists/' + listId, updateList).then(() => {
                showNotification({
                    message: 'Movie Removed from List',
                    color: 'teal',
                    icon: <BiCheck />,
                })
                return optimisticData
            }),
            {
                rollbackOnError: true,
                optimisticData,
            }
        )
    }

    const unlinkUserFromList = async (listId: string) => {
        if (session?.user?.email) {
            const updateList: Prisma.MovieListUpdateInput = {
                id: listId,
                users: {
                    disconnect: {
                        email: session?.user?.email,
                    },
                },
            }

            const updatedMovieLists = swrMovieLists?.filter(
                list => list.id !== listId
            )

            const updatedPublicLists = [
                ...publicMovieLists.map(list =>
                    list.id === listId
                        ? {
                              ...list,
                              users: list.users.filter(
                                  user => user.id !== session?.user?.userId
                              ),
                          }
                        : list
                ),
            ]

            await Promise.all([
                mutate(
                    '/api/movieLists',
                    axios
                        .put('/api/movieLists/' + listId, updateList)
                        .then(_res => {
                            showNotification({
                                message: 'Movie List unfollowed',
                                color: 'teal',
                                icon: <BiCheck />,
                            })
                            return updatedMovieLists
                        }),
                    {
                        rollbackOnError: true,
                        optimisticData: updatedMovieLists,
                    }
                ),
                mutate('/api/movieLists/public', updatedPublicLists, {
                    revalidate: false,
                }),
            ])
        }
    }

    const linkUserToList = async (listId: string) => {
        if (session?.user?.email) {
            const thisSwrList = publicMovieLists?.find(
                list => list.id === listId
            ) as FullMovieList
            const updateList: Prisma.MovieListUpdateInput = {
                id: listId,
                users: {
                    connect: {
                        email: session?.user?.email,
                    },
                },
            }

            const updatedMovieLists = [
                {
                    ...thisSwrList,
                    users: [
                        ...thisSwrList.users,
                        { id: session?.user?.userId },
                    ],
                },
                ...swrMovieLists,
            ]
            const updatedPublicLists = publicMovieLists?.map(list =>
                list.id === listId
                    ? {
                          ...list,
                          users: [...list.users, { id: session?.user?.userId }],
                      }
                    : list
            )

            await Promise.all([
                mutate(
                    '/api/movieLists',
                    axios
                        .put('/api/movieLists/' + listId, updateList)
                        .then(_res => {
                            showNotification({
                                message: 'Followed List',
                                color: 'teal',
                                icon: <BiCheck />,
                            })

                            return updatedMovieLists
                        }),
                    {
                        optimisticData: updatedMovieLists,
                        rollbackOnError: true,
                    }
                ),
                mutate('/api/movieLists/public', updatedPublicLists, {
                    revalidate: false,
                }),
            ])
        }
    }

    const incrementListViews = async (listId: string) => {
        const thisList = swrMovieLists.find(
            list => list.id === listId
        ) as MovieList
        const updateList: Prisma.MovieListUpdateInput = {
            id: listId,
            views: thisList?.views + 1,
        }

        const updatedMovieLists = swrMovieLists?.map(list =>
            list.id === listId ? { ...list, views: list.views + 1 } : list
        )

        await mutate(
            '/api/movieLists',
            axios.put('/api/movieLists/' + listId, updateList).then(_res => {
                showNotification({
                    message: 'Viewed List',
                    color: 'teal',
                    icon: <BsEye />,
                })
                return updatedMovieLists
            }),
            { optimisticData: updatedMovieLists, revalidate: false }
        )
    }

    return {
        createMovieList,
        deleteMovieList,
        addMovieToList,
        removeMovieFromList,
        createWatchList,
        unlinkUserFromList,
        linkUserToList,
        incrementListViews,
    }
}
