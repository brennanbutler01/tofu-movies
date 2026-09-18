import { withProviderAccess } from 'server/providerAccess'
import axios from 'server/providerHttp'
import { NextApiRequest, NextApiResponse } from 'next'

export interface IProviderDetails {
    display_priority?: number
    logo_path?: string
    provider_id?: number
    provider_name?: string
}

export interface IProviderResult {
    link?: string
    rent?: Array<IProviderDetails>
    buy?: Array<IProviderDetails>
    flatrate?: Array<IProviderDetails>
    ads?: Array<IProviderDetails>
}

const WATCH_PROVIDER_URL = (id: number) =>
    `https://api.themoviedb.org/3/movie/${id}/watch/providers`

export const getWatchProviders = async (
    id: number
): Promise<IProviderResult | void> =>
    await axios
        .get(WATCH_PROVIDER_URL(id), {
            params: {
                api_key: process.env.MOVIE_KEY,
            },
        })
        .then(res => res.data.results.US)
        .catch(() => {
            throw new Error('Movie information is temporarily unavailable.')
        })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const providers = await getWatchProviders(
            parseInt(req.query.id as string)
        )
        res.status(200).json(providers)
    } catch (err) {
        res.status(403).json({ err: 'Error getting watch providers ' + err })
    }
}
export default withProviderAccess(handler)
