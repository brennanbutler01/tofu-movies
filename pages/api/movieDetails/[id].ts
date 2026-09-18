import { sampleSearch, sampleMovies } from 'server/sampleCatalogue'
import { withVisitorGuard } from 'server/visitor'
import { withProviderAccess } from 'server/providerAccess'
import { NextApiRequest, NextApiResponse } from 'next'

import axios from 'server/providerHttp'

interface IGenre {
    id?: number
    name?: string
}

interface ILanguage {
    english_name?: string
    iso_639_1?: string
    name?: string
}

export interface IProductionCompany {
    id?: number
    logo_path?: string | null
    name?: string
    origin_country?: string
}

interface IProductionCountry {
    iso_3166_1?: string
    name?: string
}

export interface IMovieDetail {
    adult?: boolean
    backdrop_path?: string
    belongs_to_collection?: boolean | null
    budget?: number
    genres?: Array<IGenre>
    homepage?: string
    id?: number
    imdb_id?: string
    original_language?: string
    original_title?: string
    overview?: string
    popularity?: number
    poster_path?: string
    release_date?: string
    revenue?: number
    runtime?: number
    spoken_languages?: Array<ILanguage>
    status?: string
    tagline?: string
    title?: string
    video?: boolean
    vote_average?: number
    vote_count?: number
    production_companies?: Array<IProductionCompany>
    production_countries?: Array<IProductionCountry>
}

const MOVIE_DETAIL_URL = 'https://api.themoviedb.org/3/movie'

export const getMovieDetails = async (id: number) =>
    process.env.VISITOR_DEMO === 'true'
        ? sampleMovies.find(movie => movie.id === id)
        : await axios
              .get<IMovieDetail>(`${MOVIE_DETAIL_URL}/${id}`, {
                  params: {
                      api_key: process.env.MOVIE_KEY,
                  },
              })
              .then(res => {
                  console.log('res', res.data)
                  return res.data
              })
              .catch(() => {
                  throw new Error(
                      'Movie information is temporarily unavailable.'
                  )
              })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const movieDetails = await getMovieDetails(
            parseInt(req.query.id as string)
        )
        res.status(200).json(movieDetails)
    } catch (err) {
        res.status(403).json({
            err: 'There was an error getting movie details ' + err,
        })
    }
}
export default withVisitorGuard(withProviderAccess(handler))
