import axios from 'axios'
import { useSWRConfig } from 'swr'
import { useMovieSWR } from 'movies/useMovieSWR'
import { useMovieCRUD } from 'movies/useMovieCRUD'

export const useUserMovieCRUD = () => {
    const movies = useMovieSWR({})
    const { createDbMovie } = useMovieCRUD()
    const { mutate } = useSWRConfig()
    const createUserMovie = async ({
        tmdb_id,
        seen = false,
    }: {
        tmdb_id: number
        seen?: boolean
    }) => {
        const existing = movies?.find(movie => movie.tmdb_id === tmdb_id)
        const prepared = existing
            ? undefined
            : await createDbMovie(tmdb_id, false)
        if (!existing && !prepared)
            throw new Error('Could not load this movie. Please retry.')
        await axios.post('/api/userMovies', {
            seen,
            movie: existing
                ? { connect: { tmdb_id } }
                : { create: prepared?.create },
        })
        await Promise.all([mutate('/api/userMovies'), mutate('/api/movies')])
    }
    const updateUserMovie = async ({
        userMovieId,
        seen,
    }: {
        userMovieId: string
        seen: boolean
    }) => {
        await axios.put('/api/userMovies/' + userMovieId, { seen })
        await mutate('/api/userMovies')
    }
    return { createUserMovie, updateUserMovie }
}
