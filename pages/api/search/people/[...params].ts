import { withVisitorGuard } from 'server/visitor'
import { withProviderAccess } from 'server/providerAccess'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'server/providerHttp'
import { IPersonResponse } from '../../people'

const url = 'https://api.themoviedb.org/3/search/person'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const query = req.query.params
    console.log('query', query)

    const typedQuery: [string, string] | null = Array.isArray(query)
        ? query.length === 1
            ? [query[0], '1']
            : [query[0], query[1]]
        : ['', '1']

    if (typedQuery) {
        const [query, page] = typedQuery
        try {
            const search = await axios
                .get<IPersonResponse>(url, {
                    params: {
                        language: 'en-US',
                        api_key: process.env.MOVIE_KEY,
                        query,
                        page,
                    },
                })
                .then(res => res.data)
                .catch(() => {
                    throw new Error(
                        'Movie information is temporarily unavailable.'
                    )
                })
            res.status(200).json(search)
        } catch (err) {
            res.status(403).json({
                err: 'there was an error trying to get person results' + err,
            })
        }
    }
}
export default withVisitorGuard(withProviderAccess(handler))
