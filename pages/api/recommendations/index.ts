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
    await axios
        .get<IRecommendation>(url(id), {
            params: {
                api_key: process.env.MOVIE_KEY,
            },
        })
        .then(res => res.data.results)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
    } catch (err) {
        res.status(403).json({
            err: 'We have an error trying to get recommendations ' + err,
        })
    }
}
