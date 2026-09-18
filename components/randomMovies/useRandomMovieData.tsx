import axios from 'axios'
import { IMovieDetail } from '../../pages/api/movieDetails/[id]'
import {
    IProviderDetails,
    IProviderResult,
} from '../../pages/api/watchProviders/[id]'
import { IOmdbResponse } from '../../pages/api/omdb/[id]'
import { showNotification } from '@mantine/notifications'
import { IMovieAPIResults } from '../../pages/api/search/[...params]'
import randomWords from 'random-words'
import { Movie } from '@prisma/client'
import { randomIntFromInterval } from '../../utils/randomIntFromInterval'
import { RandomMovieSources } from '../../pages/randomMovie'
import { useMovieListsSWR } from '../../movieLists/useMovieListsSWR'
import { useUserProvidersSWR } from '../../userProviders/useUserProvidersSWR'
import { useState } from 'react'

interface IUseRandomMovieData {
    imdbRating?: number
    segmentedValue: RandomMovieSources
    movieLists?: string[]
}

export const useRandomMovieData = ({
    imdbRating,
    segmentedValue,
    movieLists,
}: IUseRandomMovieData) => {
    const { data: userLists } = useMovieListsSWR({})
    const userProviders = useUserProvidersSWR()
    const [fullMovie, setFullMovie] = useState<IMovieDetail>()
    const [omdbDetails, setOmdbDetails] = useState<IOmdbResponse>()
    const [watchProviders, setWatchProviders] = useState<IProviderResult>()
    const [loading, setLoading] = useState(false)

    const getMovieDetails = async (
        tmdb_id: number,
        providerIds?: number[],
        imdbRating?: number
    ) => {
        console.log('tmdb', tmdb_id)
        const [details, watchProviders] = await Promise.all([
            axios
                .get<IMovieDetail>('/api/movieDetails/' + tmdb_id)
                .then(res => res.data),
            axios
                .get<IProviderResult>('/api/watchProviders/' + tmdb_id)
                .then(res => res.data),
        ])
        const { link, ...rest } = watchProviders
        const checkWatchProviders = !!(
            watchProviders &&
            providerIds &&
            Object.values(rest)?.some((val: IProviderDetails[]) =>
                val.some(provider =>
                    providerIds?.includes(provider?.provider_id || -1)
                )
            )
        )
        console.log('check watch', checkWatchProviders)
        if (details?.imdb_id && (checkWatchProviders || !providerIds)) {
            const omdbDetails = await axios
                .get<IOmdbResponse>('/api/omdb/' + details?.imdb_id)
                .then(res => res.data)

            console.log('omdbDetails', omdbDetails?.imdbRating, imdbRating)
            if (omdbDetails?.imdbRating && imdbRating) {
                const dbRating = parseFloat(omdbDetails?.imdbRating)
                showNotification({
                    message:
                        'Imdb Rating:' +
                        imdbRating +
                        '--- Db Rating: ' +
                        dbRating,
                })
                if (dbRating <= imdbRating) {
                    console.log('returning false 1')
                    return false
                }
            }

            console.log('setting movies')
            setFullMovie(details)
            setOmdbDetails(omdbDetails)
            setWatchProviders(watchProviders)
            return true
        } else {
            console.log('returning false 2')
            return false
        }
    }

    //TODO - not urgent, but could make random movies a lot more efficient by:
    // 1) Using SWR to cache, 2) Looking through the rest of the array items rather than just one before fetching
    const getMovieSource = (segmentedValue: RandomMovieSources) => {
        if (segmentedValue === 'all') {
            const getRemoteMovie = async () => {
                setLoading(true)
                await axios
                    .get<IMovieAPIResults>(
                        '/api/randomMovie/' + randomWords(1).join('')
                    )
                    .then(async res => {
                        const hasDetails = await getMovieDetails(
                            res.data.id as number
                        )
                        console.log('has details', hasDetails)
                        if (!hasDetails) {
                            console.log('has to go again')
                            await getRemoteMovie()
                        }
                        setLoading(false)
                    })
            }
            return getRemoteMovie
        } else if (segmentedValue === 'lists') {
            const listMovies = Array.from(
                new Set(
                    userLists?.reduce<Movie[]>((acc, curr) => {
                        if (movieLists && movieLists?.length > 0) {
                            return [
                                ...acc,
                                ...(movieLists?.includes(curr.id)
                                    ? curr.movies
                                    : []),
                            ]
                        } else {
                            return [...acc, ...curr.movies]
                        }
                    }, [])
                )
            )

            const getListMovie = async () => {
                const randomMovie =
                    listMovies[randomIntFromInterval(0, listMovies?.length - 1)]
                setLoading(true)
                const movieDetails = await getMovieDetails(randomMovie?.tmdb_id)
                if (!movieDetails) {
                    await getListMovie()
                } else {
                    setLoading(false)
                }
            }
            return getListMovie
        } else {
            const userProviderIds = userProviders
                ?.filter(p => p.linked)
                ?.map(p => p.tmdb_id)
            console.log('user providers', userProviders)
            const getMovieOnUserProvider = async () => {
                console.log('getting')
                setLoading(true)
                await axios
                    .get<IMovieAPIResults>(
                        '/api/randomMovie/' + randomWords(1).join('')
                    )
                    .then(async res => {
                        const hasDetails = await getMovieDetails(
                            res.data.id as number,
                            userProviderIds,
                            imdbRating
                        )

                        if (!hasDetails) {
                            await getMovieOnUserProvider()
                        }
                        setLoading(false)
                    })
            }
            return getMovieOnUserProvider
        }
    }
    return {
        loading,
        fullMovie,
        watchProviders,
        omdbDetails,
        movieFetchFunction: getMovieSource(segmentedValue),
    }
}
