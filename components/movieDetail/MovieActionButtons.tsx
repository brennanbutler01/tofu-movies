import { Group, ActionIcon, Text, createStyles } from '@mantine/core'
import { useMovieListsCRUD } from 'movieLists/useMovieListsCRUD'
import { useMovieListsSWR } from 'movieLists/useMovieListsSWR'
import { IMovieAPIResults } from 'pages/api/search/[...params]'
import { BiPlus, BiCheck } from 'react-icons/bi'
import { useMovieSWR } from 'movies/useMovieSWR'
import { MovieListTitles } from '../search/MovieListMenu'
import { useUserMovieSWR } from 'userMovies/useUserMovieSWR'
import { useUserMovieCRUD } from 'userMovies/useUserMovieCRUD'
import { ReviewModalButton } from '@/components/movieReviews/ReviewModalButton'
import React from 'react'

const useStyles = createStyles((_, _params) => ({
    verticalFlex: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
    },
}))

interface IMovieActionButtons {
    movie: IMovieAPIResults
}

interface IButtonWrapper {
    children: React.ReactNode
}

const ButtonWrapper = ({ children }: IButtonWrapper) => {
    const { classes } = useStyles()

    return <div className={classes.verticalFlex}>{children}</div>
}

export const MovieActionButtons = ({ movie }: IMovieActionButtons) => {
    const { addMovieToList, removeMovieFromList } = useMovieListsCRUD()
    const { data: movieLists } = useMovieListsSWR({})
    const watchList = movieLists?.find(
        list => list.title === MovieListTitles.Watchlist
    )
    const watchListHasThisFilm = watchList?.movies?.find(
        m => m.tmdb_id === movie?.id
    )
    const swrMovies = useMovieSWR({})
    const thisMovie = swrMovies?.find(m => m.tmdb_id === movie?.id)
    const swrUserMovies = useUserMovieSWR({})
    const { createUserMovie, updateUserMovie } = useUserMovieCRUD()

    return (
        <Group spacing={'lg'}>
            <ButtonWrapper>
                <ActionIcon
                    disabled={!swrMovies}
                    size='xl'
                    radius='xl'
                    variant='filled'
                    color={watchListHasThisFilm ? 'grape' : 'gray'}
                    onClick={async () =>
                        watchList?.id &&
                        (watchList?.movies?.some(m => m.tmdb_id === movie.id)
                            ? await removeMovieFromList(
                                  watchList?.id,
                                  movie?.id as number
                              )
                            : await addMovieToList(
                                  watchList?.id,
                                  movie?.id as number
                              ))
                    }
                >
                    <BiPlus size={32} />
                </ActionIcon>
                <Text color='dimmed'>To see</Text>
            </ButtonWrapper>
            <ButtonWrapper>
                <ActionIcon
                    disabled={!swrMovies}
                    size='xl'
                    radius={'xl'}
                    variant='filled'
                    color={
                        swrUserMovies?.find(m => m.movieId === thisMovie?.id)
                            ?.seen
                            ? 'grape'
                            : 'gray'
                    }
                    onClick={async () => {
                        const thisUserMovie = swrUserMovies?.find(
                            m => m.movieId === thisMovie?.id
                        )

                        console.log('has user movie', thisUserMovie)
                        if (!thisUserMovie) {
                            await createUserMovie({
                                tmdb_id: movie?.id as number,
                                seen: true,
                            })
                        } else {
                            await updateUserMovie({
                                userMovieId: thisUserMovie?.id,
                                seen: !thisUserMovie?.seen,
                            })
                        }
                    }}
                >
                    <BiCheck size={32} />
                </ActionIcon>
                <Text color='dimmed'>Seen it</Text>
            </ButtonWrapper>
            <ButtonWrapper>
                <ReviewModalButton movie={movie} disabled={!swrMovies} />

                <Text color='dimmed'>Rate It</Text>
            </ButtonWrapper>
        </Group>
    )
}
