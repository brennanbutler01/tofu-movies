import { withProviderAccess } from 'server/providerAccess'
import { IConfig, getImageUrl } from 'pages/api/config'
import { IMovieDetail, getMovieDetails } from 'pages/api/movieDetails/[id]'
import { getCredits, ICreditAPIResponse } from 'pages/api/credits/[id]'
import {
    IProviderResult,
    getWatchProviders,
} from 'pages/api/watchProviders/[id]'
import { NextApiRequest, NextApiResponse } from 'next'

export interface IMovieDetailResponse {
    movieDetails: void | IMovieDetail
    watchProviders: void | IProviderResult
    imageConfig: void | IConfig
    movieCredits: void | ICreditAPIResponse
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req
    try {
        const id = parseInt(query?.id as string) as number
        const [movieDetailsResults, watchProviders, imageConfig, movieCredits] =
            await Promise.all([
                getMovieDetails(id),
                getWatchProviders(id),
                getImageUrl(),
                getCredits(id),
            ])

        res.status(200).json({
            movieDetails: movieDetailsResults,
            watchProviders,
            imageConfig,
            movieCredits,
        })
    } catch (err) {
        res.status(403).json({
            err: `There was an error trying to get movie details - ${err}`,
        })
    }
}

export default withProviderAccess(handler)
