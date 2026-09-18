import { sampleSearch, sampleMovies } from 'server/sampleCatalogue'
import { withVisitorGuard } from 'server/visitor'
import { withProviderAccess } from 'server/providerAccess'
import { NextApiRequest, NextApiResponse } from 'next'

import axios from 'server/providerHttp'
import { IMovieResponse } from 'pages/api/search/[...params]'

export const getTrending = async (page?: number) =>
    process.env.VISITOR_DEMO === 'true'
        ? sampleSearch()
        : await axios
              .get<IMovieResponse>(
                  'https://api.themoviedb.org/3/trending/movie/day',
                  {
                      params: {
                          api_key: process.env.MOVIE_KEY,
                          page,
                      },
                  }
              )
              .then(res => res.data)
              .catch(() => {
                  throw new Error(
                      'Movie information is temporarily unavailable.'
                  )
              })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { page } = req.query
    try {
        const trending = await getTrending(parseInt(page as string))
        res.status(200).json(trending)
    } catch (err) {
        res.status(403).json({ err: 'Error getting trending...' + err })
    }
}

export default withVisitorGuard(withProviderAccess(handler))
