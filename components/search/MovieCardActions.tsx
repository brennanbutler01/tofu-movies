import { Group, Button } from '@mantine/core'
import { BiCheck } from 'react-icons/bi'
import { useMovieSWR } from 'movies/useMovieSWR'
import { MovieListMenu } from './MovieListMenu'
import { useUserMovieSWR } from 'userMovies/useUserMovieSWR'
import { useUserMovieCRUD } from 'userMovies/useUserMovieCRUD'

interface IMovieActions {
    tmdb_id: number
}
export const MovieCardActions = ({ tmdb_id }: IMovieActions) => {
    const { createUserMovie, updateUserMovie } = useUserMovieCRUD()

    const swrMovies = useMovieSWR({})
    const userMovies = useUserMovieSWR({})

    const thisMovie = swrMovies?.find(m => m.tmdb_id === tmdb_id)
    const thisUserMovie = userMovies?.find(
        movie => movie.movieId === thisMovie?.id
    )

    return (
        <Group noWrap py='md'>
            <MovieListMenu tmdb_id={tmdb_id} />
            <Button
                leftIcon={thisUserMovie?.seen && <BiCheck />}
                size='xs'
                radius='xl'
                color='green'
                variant={thisUserMovie?.seen ? 'filled' : 'outline'}
                onClick={async () =>
                    thisUserMovie
                        ? await updateUserMovie({
                              userMovieId: thisUserMovie?.id,
                              seen: !thisUserMovie?.seen,
                          })
                        : await createUserMovie({ tmdb_id, seen: true })
                }
            >
                seen?
            </Button>
        </Group>
    )
}
