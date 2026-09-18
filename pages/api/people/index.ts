import { withVisitorGuard } from 'server/visitor'
import { withProviderAccess } from 'server/providerAccess'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'server/providerHttp'
import { getImageUrl } from '../config'

interface IKnownFor {
    poster_path?: string | null
    overview?: string
    id?: number
    media_type?: string
    original_language?: string
    backdrop_path?: string | null
    popularity?: number
    vote_count?: number
    vote_average?: number
}

interface IKnownForV1 extends IKnownFor {
    adult?: boolean
    release_date?: string
    original_title?: string
    genre_ids?: number[]
    title?: string
    video?: boolean
}

interface IKnownForV2 extends IKnownFor {
    vote_average?: number
    first_air_date?: string
    origin_county?: string[]
    genre_ids?: number[]
    name?: string
    original_name?: string
}

export interface IPersonAPIResults {
    profile_path?: string | null
    adult?: boolean
    id?: number
    known_for: IKnownForV1 | IKnownForV2
    name?: string
    popularity?: string
    value: string
}

export interface IPersonResponse {
    page?: number
    results: Array<IPersonAPIResults>
    total_results: number
    total_pages: number
}

const url = 'https://api.themoviedb.org/3/search/person'

export const personSearch = async (query: string) =>
    await axios
        .get<IPersonResponse>(url, {
            params: {
                language: 'en-US',
                api_key: process.env.MOVIE_KEY,
                query,
            },
        })
        .then(res => res.data.results)
        .catch(() => {
            throw new Error('Movie information is temporarily unavailable.')
        })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const [personResults, config] = await Promise.all([
            personSearch(req.query.query as string),
            getImageUrl(),
        ])

        if (config && personResults) {
            const fullPersonResults = personResults?.map(p => ({
                ...p,
                value: p?.name,
                profile_path: `${config?.base_url}/${
                    config?.profile_sizes[config?.profile_sizes?.length - 1]
                }/${p?.profile_path}`,
            }))
            res.status(200).json(fullPersonResults)
        } else {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('No config or no person results')
        }
    } catch (err) {
        res.status(403).json({
            err: 'There was an error getting person results ' + err,
        })
    }
}

export default withVisitorGuard(withProviderAccess(handler))
