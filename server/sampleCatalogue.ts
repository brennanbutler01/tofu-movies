import type { IMovieDetail } from 'pages/api/movieDetails/[id]'
import type { IMovieResponse } from 'pages/api/search/[...params]'

export const sampleMovies: IMovieDetail[] = [
    {
        id: 910001,
        title: 'The Last Lighthouse',
        original_title: 'The Last Lighthouse',
        overview:
            'A lighthouse keeper and a visiting engineer work together to restore a coastal beacon before a winter storm. Fictional portfolio sample.',
        tagline: 'One small light can change the way home.',
        release_date: '2024-03-15',
        runtime: 104,
        genres: [{ id: 18, name: 'Drama' }],
    },
    {
        id: 910002,
        title: 'Orbit Café',
        original_title: 'Orbit Café',
        overview:
            'Two friends open the first café on a remote space station and discover that good coffee cannot solve every problem. Fictional portfolio sample.',
        tagline: 'A fresh start, a little farther from home.',
        release_date: '2025-06-20',
        runtime: 98,
        genres: [{ id: 35, name: 'Comedy' }],
    },
    {
        id: 910003,
        title: 'Paper Maps',
        original_title: 'Paper Maps',
        overview:
            'An archivist follows a collection of handwritten maps through a changing city. Fictional portfolio sample.',
        tagline: 'Every street holds a story.',
        release_date: '2023-10-06',
        runtime: 112,
        genres: [{ id: 9648, name: 'Mystery' }],
    },
]
export function sampleSearch(query = ''): IMovieResponse {
    const matches = sampleMovies.filter(movie =>
        movie.title?.toLowerCase().includes(query.toLowerCase())
    )
    return {
        page: 1,
        total_pages: 1,
        total_results: matches.length,
        results: matches.map(movie => ({ ...movie, value: String(movie.id) })),
    }
}
