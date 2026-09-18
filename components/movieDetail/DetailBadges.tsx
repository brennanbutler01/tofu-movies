import { Badge, Group } from '@mantine/core'
import dayjs from 'dayjs'
import { IMovieDetail } from 'pages/api/movieDetails/[id]'
import { IOmdbResponse } from 'pages/api/omdb/[id]'

interface IDetailBadges {
    fullMovie: IMovieDetail
    omdbResult?: IOmdbResponse | void
    combineGenres?: boolean
}
export const DetailBadges = ({
    fullMovie,
    omdbResult,
    combineGenres = false,
}: IDetailBadges) => {
    const genres = (
        combineGenres
            ? [
                  fullMovie?.genres?.reduce((acc, curr, i) => {
                      return acc + (i === 0 ? '' : ', ') + curr?.name
                  }, ''),
              ]
            : fullMovie?.genres?.map(g => g?.name) || []
    )?.map(genre => (
        <Badge key={genre} id={genre}>
            {genre}
        </Badge>
    ))
    return (
        <Group>
            {genres}
            <Badge>{fullMovie?.runtime} minutes</Badge>

            {dayjs(fullMovie?.release_date)?.isValid() && (
                <Badge>{dayjs(fullMovie?.release_date).year()}</Badge>
            )}
            {omdbResult?.Rated && <Badge>{omdbResult?.Rated}</Badge>}
        </Group>
    )
}
