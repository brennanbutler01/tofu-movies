import { withVisitorGuard } from 'server/visitor'
import { NextApiRequest, NextApiResponse } from 'next'
import { getImageUrl } from '../config'
import { movieSearch } from '../search/[...params]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.query

    if (query) {
        try {
            const [config, movieResults] = await Promise.all([
                getImageUrl(),
                movieSearch(query as string).then(res => res && res.results),
            ])

            if (config && movieResults) {
                const fullMovieResults = movieResults.map(r => ({
                    ...r,
                    poster_path: `${config.base_url}/${config.poster_sizes[0]}/${r.poster_path}`,
                    value: r.title,
                }))

                res.status(200).json(fullMovieResults)
            } else {
                res.status(403).json({
                    err: 'There was an error getting config or movie results',
                })
            }
        } catch (err) {
            res.status(403).json({
                err: `There was an error getting config or movie results: ${err}`,
            })
        }
    } else {
        res.status(400).json({ err: 'Need a query!' })
    }
}

export default withVisitorGuard(handler)
