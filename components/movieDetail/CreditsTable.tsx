import { createStyles, Table } from '@mantine/core'
import { ITopHalfMovieDetail } from './TopHalfMovieDetail'

interface ICreditsTable extends Omit<ITopHalfMovieDetail, 'config'> {
    caption?: 'none'
}

const styles = createStyles(() => ({
    rowHead: {
        whiteSpace: 'nowrap',
        wordBreak: 'normal',
    },
}))

export const CreditsTable = ({
    fullMovie,
    omdbResult,
    caption,
}: ICreditsTable) => {
    const { classes } = styles()
    return (
        <Table captionSide='bottom' highlightOnHover>
            {caption !== 'none' && <caption>Credits</caption>}
            {/*<thead>*/}
            {/*  <tr>*/}
            {/*    <th>Role</th>*/}
            {/*    <th>Person Name</th>*/}
            {/*  </tr>*/}
            {/*</thead>*/}
            <tbody>
                <tr>
                    <td className={classes.rowHead}>Director(s)</td>
                    <td>{omdbResult?.Director || 'N/A'}</td>
                </tr>
                <tr>
                    <td className={classes.rowHead}>Writer(s)</td>
                    <td>{omdbResult?.Writer || 'N/A'}</td>
                </tr>
                <tr>
                    <td className={classes.rowHead}>Actor(s)</td>
                    <td>{omdbResult?.Actors || 'N/A'}</td>
                </tr>
                <tr>
                    <td className={classes.rowHead}>Produced By</td>
                    <td>
                        {fullMovie?.production_companies
                            ?.map(company => company.name)
                            .join(', ') ||
                            omdbResult?.Production ||
                            'N/A'}
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}
