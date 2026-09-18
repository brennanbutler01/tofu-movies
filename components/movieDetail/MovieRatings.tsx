import { Group } from '@mantine/core'
import { IRating } from 'utils/movieRatings'
import { RatingIcon } from './RatingIcon'

interface IMovieRatings {
    ratings: IRating[]
}

export const MovieRatings = ({ ratings }: IMovieRatings) => {
    const ratingItems = ratings.map((r, i) => (
        <RatingIcon key={i} Source={r.Source} Value={r.Value} />
    ))
    return <Group spacing={'xl'}>{ratingItems}</Group>
}
