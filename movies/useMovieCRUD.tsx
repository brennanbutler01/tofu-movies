import { Movie, Prisma } from '@prisma/client'
import axios from 'axios'
import { IOmdbResponse } from 'pages/api/omdb/[id]'
import { v4 as uuid } from 'uuid'
import { useSession } from 'next-auth/react'
import { IMovieDetailResponse } from 'pages/api/remoteMovies/[id]'
import { useMovieSWR } from './useMovieSWR'
import { useSWRConfig } from 'swr'
import { showNotification } from '@mantine/notifications'
import { BiAlarmExclamation, BiCheckCircle } from 'react-icons/bi'

export interface ReturnTypeCreateMovie {
    create: Prisma.MovieCreateInput
    mutate: Movie
}

export const useMovieCRUD = () => {
    const { data: session } = useSession()
    const swrMovieData = useMovieSWR({})
    const { mutate } = useSWRConfig()

    const createDbMovie = async (tmdb_id: number, shouldPost = true) => {
        if (
            session?.user?.email &&
            tmdb_id &&
            !swrMovieData?.find(movie => movie.tmdb_id === tmdb_id)
        ) {
            //get our details
            const details = await axios
                .get<IMovieDetailResponse>('/api/remoteMovies/' + tmdb_id)
                .then(res => res.data)

            if (details?.movieDetails) {
                //get our omdb details, that's our second half
                const omdbDetails = await axios
                    .get<IOmdbResponse>(
                        '/api/omdb/' + details?.movieDetails?.imdb_id
                    )
                    .then(res => res.data)
                    .catch(err => {
                        showNotification({
                            icon: <BiAlarmExclamation />,
                            color: 'yellow',
                            message:
                                'Error getting omdb - Please be aware that info might be limited for this film',
                        })
                        console.error(err)
                    })

                console.log('omdb details', omdbDetails)

                if (details?.imageConfig) {
                    const ourBackdrop = details?.movieDetails?.backdrop_path
                        ? `${details.imageConfig.base_url}/${details?.imageConfig?.backdrop_sizes[3]}/${details?.movieDetails?.backdrop_path}`
                        : null
                    const ourPoster =
                        omdbDetails?.Poster ||
                        details?.movieDetails?.poster_path
                            ? `${details.imageConfig.base_url}/${details.imageConfig.poster_sizes[6]}/${details.movieDetails.poster_path}`
                            : null

                    const ratings =
                        omdbDetails &&
                        omdbDetails?.Ratings &&
                        omdbDetails?.Ratings?.length > 0
                            ? omdbDetails?.Ratings?.map(r => ({
                                  id: uuid(),
                                  source: r.Source || 'Other',
                                  value: r.Value || '0',
                              }))
                            : []

                    console.log('ratings', ratings)

                    const genres = omdbDetails?.Genre
                        ? omdbDetails.Genre.split(',')
                        : details?.movieDetails?.genres?.map(
                              g => g?.name || ''
                          ) || []

                    const actors = omdbDetails?.Actors
                        ? omdbDetails?.Actors.split(',')
                        : details?.movieCredits
                        ? details?.movieCredits?.cast?.map(c => c?.name || '')
                        : []

                    const title =
                        omdbDetails?.Title || details?.movieDetails?.title

                    const release_date =
                        omdbDetails?.Released ||
                        details?.movieDetails?.release_date

                    const newMovieValues: Prisma.MovieCreateInput = {
                        id: uuid(),
                        tmdb_id: tmdb_id,
                        actors,
                        awards: omdbDetails?.Awards,
                        plot: omdbDetails?.Plot,
                        overview: details?.movieDetails?.overview,
                        box_office: omdbDetails?.BoxOffice,
                        genre: genres,
                        created: new Date(),
                        director: omdbDetails?.Director?.split(',').map(name =>
                            name.trim()
                        ),
                        title,
                        poster: ourPoster,
                        imdb_id: details?.movieDetails?.imdb_id,
                        backdrop: ourBackdrop,
                        release_date,
                        writers: omdbDetails?.Writer?.split(','),
                        tagline: details?.movieDetails?.tagline,
                        original_title: details?.movieDetails?.original_title,
                        maturity_rating: omdbDetails?.Rated,
                    }

                    const newUserMovie: Prisma.MovieCreateInput = {
                        ...newMovieValues,
                        ...(ratings &&
                            ratings?.length > 0 && {
                                ratings: {
                                    createMany: {
                                        data: ratings,
                                    },
                                },
                            }),
                    }

                    console.log(newUserMovie, 'new user movie')

                    const optimisticData = [
                        ...swrMovieData,
                        {
                            ...newMovieValues,
                        },
                    ]

                    if (shouldPost) {
                        await mutate(
                            '/api/movies',
                            axios.post('/api/movies', newUserMovie).then(() => {
                                showNotification({
                                    message: 'Successfully Created User Movie',
                                    icon: <BiCheckCircle />,
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

                    return {
                        mutate: newMovieValues,
                        create: newUserMovie,
                    } as ReturnTypeCreateMovie
                }
            }
        }
    }

    return { createDbMovie }
}
