import { Paper, Group } from '@mantine/core'
import { IMovieDetail } from 'pages/api/movieDetails/[id]'
import { CopyLocationButton } from './CopyLocationButton'
import { MovieDetailBreadcrumb } from './MovieDetailBreadcrumb'

interface IMovieHeader {
    fullMovie: IMovieDetail
}

export const MovieHeader = ({ fullMovie }: IMovieHeader) => {
    return (
        <Paper radius='lg' p='lg' shadow='xl'>
            <Group position='apart'>
                <MovieDetailBreadcrumb fullMovie={fullMovie} />
                <CopyLocationButton fullMovie={fullMovie} />
            </Group>
        </Paper>
    )
}
