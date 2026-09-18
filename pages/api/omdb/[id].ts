import { withVisitorGuard } from 'server/visitor'
import { withProviderAccess } from 'server/providerAccess'
import { NextApiRequest, NextApiResponse } from 'next'

import axios from 'server/providerHttp'

import { RatingSources, IRating } from 'utils/movieRatings'

export interface IOmdbResponse {
    Title?: string
    Year?: string
    Rated?: string
    Released?: string
    Runtime?: string
    Genre?: string
    Director?: string
    Writer?: string
    Actors?: string
    Plot?: string
    Language?: string
    Country?: string
    Awards?: string
    Poster?: string
    Metascore?: string
    imdbRating?: string
    imdbVotes?: string
    imdbId?: string
    Type?: string
    DVD?: string
    BoxOffice?: string
    Production?: string
    Website?: string
    Response?: string
    Ratings?: Array<IRating>
}

const OMDB_URL = 'https://www.omdbapi.com/'

export const getOmdb = async (imdbId: string) =>
    process.env.VISITOR_DEMO === 'true'
        ? {}
        : await axios
              .get<IOmdbResponse>(OMDB_URL, {
                  params: {
                      apikey: process.env.OMDB_KEY,
                      i: imdbId,
                      plot: 'full',
                  },
              })
              .then(res => res.data)
              .catch(() => {
                  throw new Error(
                      'Movie information is temporarily unavailable.'
                  )
              })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const omdbResponse = await getOmdb(req.query.id as string)
        res.status(200).json(omdbResponse)
    } catch (err) {
        res.status(403).json({
            err: `There was an error getting the omdb results- ${err}`,
        })
    }
}

export default withVisitorGuard(withProviderAccess(handler, 'omdb'))
