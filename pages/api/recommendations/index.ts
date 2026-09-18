import { withVisitorGuard } from 'server/visitor'
import { withProviderAccess } from 'server/providerAccess'
import { sampleMovies } from 'server/sampleCatalogue'
// noinspection JSUnusedLocalSymbols

import axios from 'server/providerHttp'
import { NextApiRequest, NextApiResponse } from 'next'

export interface IRecommendationResult {
    poster_path?: string | null
    title?: string
    id: number
    release_date?: string
    overview?: string
}

interface IRecommendation {
    page?: number
    results: IRecommendationResult[]
}

const url = (id: number) =>
    'https://api.themoviedb.org/3/movie/' + id + '/recommendations'

export const getRecommendations = async (id: number) =>
    process.env.VISITOR_DEMO === 'true'
        ? sampleMovies
              .filter(movie => movie.id !== id)
              .map(movie => ({
                  id: movie.id!,
                  title: movie.title,
                  overview: movie.overview,
                  release_date: movie.release_date,
              }))
        : await axios
              .get<IRecommendation>(url(id), {
                  params: {
                      api_key: process.env.MOVIE_KEY,
                  },
              })
              .then(res => res.data.results)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = Number(req.query.id)
    if (!Number.isSafeInteger(id) || id <= 0) {
        res.status(400).json({ error: 'A valid movie ID is required.' })
        return
    }
    res.json(await getRecommendations(id))
}

export default withVisitorGuard(withProviderAccess(handler))
