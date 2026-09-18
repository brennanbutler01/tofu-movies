import { withProviderAccess } from 'server/providerAccess'
import axios from 'server/providerHttp'
import { NextApiRequest, NextApiResponse } from 'next'

export interface ICreditAPIResponse {
    id?: number
    cast?: Array<ICreditCast>
    crew?: Array<ICreditCrew>
}

interface ICreditProps {
    adult?: boolean
    gender?: number | null
    id?: number
    known_for_department?: string
    name?: string
    original_name?: string
    popularity?: number
    profile_path?: string | null
    credit_id?: string
}

export interface ICreditCast extends ICreditProps {
    cast_id?: number
    character?: string
    credit_id?: string
    order?: number
}

export interface ICreditCrew extends ICreditProps {
    department?: string
    job?: string
}

export type CastOrCrew = ICreditCast | ICreditCrew

const CREDITS_URL = (movieId: number) =>
    `https://api.themoviedb.org/3/movie/${movieId}/credits`

export const getCredits = async (movieId: number) =>
    await axios
        .get<ICreditAPIResponse>(CREDITS_URL(movieId), {
            params: {
                api_key: process.env.MOVIE_KEY,
            },
        })
        .then(res => res.data)
        .catch(() => {
            throw new Error('Movie information is temporarily unavailable.')
        })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const credits = await getCredits(parseInt(req.query.id as string))
        res.status(200).json(credits)
    } catch (err) {
        res.status(403).json({
            err: 'There was an error getting credits ' + err,
        })
    }
}

export default withProviderAccess(handler)
