import { Table } from '@mantine/core'
import { ReviewWithMovie } from 'pages/api/reviews'

interface IReviewTable {
    thisReview: ReviewWithMovie
}
export const ReviewTable = ({ thisReview }: IReviewTable) => {
    const tableData = [
        { title: 'Title', data: thisReview.movie.title },
        { title: 'Release Date', data: thisReview.movie.release_date },
        { title: 'Director', data: thisReview.movie.director },
        { title: 'Actor(s)', data: thisReview.movie.actors.join(', ') },
        { title: 'Genre(s)', data: thisReview.movie.genre.join(', ') },
        { title: 'Writer(s)', data: thisReview.movie.writers.join(', ') },
        {
            title: 'Online Ratings',
            data: thisReview.movie?.ratings?.map(r => (
                <div style={{ display: 'block' }} key={r.id}>
                    {r.source} {r.value}{' '}
                </div>
            )),
        },
    ]
    const body = tableData.map(data => (
        <tr key={data.title}>
            <td>{data.title}</td>
            <td>{data.data}</td>
        </tr>
    ))
    return (
        <Table
            highlightOnHover
            sx={theme => ({
                background:
                    theme.colorScheme === 'dark'
                        ? theme.colors.dark[7]
                        : 'initial',
            })}
        >
            <tbody>{body}</tbody>
        </Table>
    )
}
