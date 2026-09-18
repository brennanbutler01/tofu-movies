import axios from 'server/providerHttp'

export interface IPersonDetail {
    birthday?: string | null
    known_for_department?: string
    deathday?: string | null
    id?: number
    name?: string
    also_known_as?: string[]
    gender?: number
    biography?: string
    popularity?: number
    place_of_birth?: string | null
    profile_path?: string | null
    adult?: boolean
    imdb_id?: string
    homepage?: string | null
}

export const getPersonDetails = async (query: string) =>
    await axios
        .get<IPersonDetail>(' https://api.themoviedb.org/3/person/' + query, {
            params: {
                api_key: process.env.MOVIE_KEY,
            },
        })
        .then(res => res.data)
        .catch(() => {
            throw new Error('Movie information is temporarily unavailable.')
        })

interface IPersonCastCrew {
    id?: number
    original_language?: string
    episode_count?: number
    overview?: string
    origin_country?: string[]
    original_name?: string
    vote_count?: number
    media_type?: string
    popularity?: number
    credit_id?: string
    original_title?: string
    title?: string
    adult?: boolean
    video?: boolean
    backdrop_path?: string | null
    release_date?: string
    first_air_date?: string
    poster_path?: string
    name?: string
    genre_ids?: number[]
    vote_average?: number
}

export interface IPersonCastCredits extends IPersonCastCrew {
    character?: string
}

export interface IPersonCrewCredits extends IPersonCastCrew {
    department?: string
    job?: string
}

export interface IPersonCastCrewResponse {
    id?: number
    cast: Array<IPersonCastCredits>
    crew: Array<IPersonCrewCredits>
}

export const getPersonCredits = async (id: number) =>
    await axios
        .get<IPersonCastCrewResponse>(
            'https://api.themoviedb.org/3/person/' + id + '/movie_credits',
            {
                params: { api_key: process.env.MOVIE_KEY },
            }
        )
        .then(res => res.data)
        .catch(() => {
            throw new Error('Movie information is temporarily unavailable.')
        })
