import {
    Button,
    Group,
    GroupPosition,
    MantineSize,
    useMantineTheme,
} from '@mantine/core'
import Link from 'next/link'
import { BiCheck, BiPlay } from 'react-icons/bi'
import { MovieListMenu, MovieListTitles } from '../search/MovieListMenu'
import { useMovieListsSWR } from 'movieLists/useMovieListsSWR'
import { GiSnailEyes } from 'react-icons/gi'
import { useMovieListsCRUD } from 'movieLists/useMovieListsCRUD'
import { useSession } from 'next-auth/react'

interface IDetailButtons {
    tmdb_id: number
    fullWidth?: boolean
    size?: MantineSize
    position?: GroupPosition
}
export const DetailButtons = ({
    tmdb_id,
    fullWidth = false,
    size = 'xl',
    position,
}: IDetailButtons) => {
    const theme = useMantineTheme()
    const { data: swrMovieLists } = useMovieListsSWR({})

    const { addMovieToList, removeMovieFromList } = useMovieListsCRUD()
    const watchList = swrMovieLists?.find(
        list => list.title === MovieListTitles.Watchlist
    )

    const inWatchlist = watchList?.movies?.find(m => m.tmdb_id === tmdb_id)

    const { status } = useSession()

    return (
        <Group {...(position && { position })}>
            <Link
                legacyBehavior
                href={`https://www.themoviedb.org/movie/${tmdb_id}`}
                passHref
            >
                <Button
                    leftIcon={<BiPlay />}
                    variant='gradient'
                    gradient={theme.other.successGradient}
                    size={size}
                    component='a'
                    target={'_blank'}
                    fullWidth={fullWidth}
                >
                    Watch Now
                </Button>
            </Link>
            {status === 'authenticated' && (
                <>
                    <Button
                        variant='white'
                        size={size}
                        rightIcon={inWatchlist ? <BiCheck /> : <GiSnailEyes />}
                        fullWidth={fullWidth}
                        onClick={async () =>
                            watchList?.id &&
                            (await (watchList?.movies?.some(
                                movie => movie.tmdb_id === tmdb_id
                            )
                                ? removeMovieFromList
                                : addMovieToList)(watchList?.id, tmdb_id))
                        }
                    >
                        {inWatchlist ? 'Watchlisted' : 'Watchlist?'}
                    </Button>
                    <MovieListMenu
                        tmdb_id={tmdb_id}
                        variant={'outline'}
                        radius={'md'}
                        size={'xl'}
                        fullWidth={fullWidth}
                    />
                </>
            )}
        </Group>
    )
}
