import { sampleSearch, sampleMovies } from 'server/sampleCatalogue'
import { withVisitorGuard } from 'server/visitor'
import { withProviderAccess } from 'server/providerAccess'
import { NextApiRequest, NextApiResponse } from 'next'

import axios from 'server/providerHttp'

export interface IMovieAPIResults {
    poster_path?: string | null
    adult?: boolean
    overview?: string
    release_date?: string
    genre_ids?: number[]
    original_title?: string
    original_language?: string
    title?: string
    backdrop_path?: string | null
    popularity?: number
    vote_count?: number
    video?: boolean
    vote_average?: number
    value: string
    id?: number
}

export interface IMovieResponse {
    page?: number
    results: Array<IMovieAPIResults>
    total_results: number
    total_pages: number
}

const url = 'https://api.themoviedb.org/3/search/movie'

export const movieSearch = async (query: string, page?: number) =>
    process.env.VISITOR_DEMO === 'true'
        ? sampleSearch(query)
        : await axios
              .get<IMovieResponse>(url, {
                  params: {
                      api_key: process.env.MOVIE_KEY,
                      query,
                      page,
                  },
              })
              .then(res => {
                  return res.data
              })
              .catch(() => {
                  throw new Error(
                      'Movie information is temporarily unavailable.'
                  )
              })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const query = req.query.params
    console.log('res.query', query)
    const typedQuery: [string, string] | null = Array.isArray(query)
        ? query.length === 1
            ? [query[0], '1']
            : [query[0], query[1]]
        : ['', '1']
    if (typedQuery) {
        const [query, page] = typedQuery
        try {
            const search = await movieSearch(query, parseInt(page))
            res.status(200).json(search)
        } catch (err) {
            res.status(44).json({ err: 'Error searching...' + err })
        }
    }
}

export default withVisitorGuard(withProviderAccess(handler))
