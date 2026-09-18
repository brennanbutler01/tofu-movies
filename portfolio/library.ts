export enum Genre {
    Drama = 'Drama',
    Adventure = 'Adventure',
    ScienceFiction = 'Sci-fi',
    Comedy = 'Comedy',
}
export type Film = {
    id: string
    title: string
    year: number
    genre: Genre
    minutes: number
    director: string
    description: string
    art: string
    initials: string
}
// These films and credits are fictional fixtures, not imported customer or licensed catalogue data.
export const films: Film[] = [
    {
        id: 'last-light',
        title: 'The Last Light',
        year: 2025,
        genre: Genre.Adventure,
        minutes: 112,
        director: 'Alex Morgan',
        art: 'sunset',
        initials: 'LL',
        description:
            'A lighthouse keeper and her estranged brother follow an unfinished map along the coast, one summer evening at a time.',
    },
    {
        id: 'small-hours',
        title: 'Small Hours',
        year: 2024,
        genre: Genre.Drama,
        minutes: 98,
        director: 'Jamie Park',
        art: 'city',
        initials: 'SH',
        description:
            'Three strangers working the night shift find an unlikely friendship in a city that never quite goes to sleep.',
    },
    {
        id: 'orbit',
        title: 'A Quiet Orbit',
        year: 2025,
        genre: Genre.ScienceFiction,
        minutes: 124,
        director: 'Sam Rivera',
        art: 'space',
        initials: 'O',
        description:
            'Alone aboard a listening station, a scientist discovers a signal that sounds remarkably like a memory she has never shared.',
    },
    {
        id: 'sunday',
        title: 'Every Other Sunday',
        year: 2023,
        genre: Genre.Comedy,
        minutes: 104,
        director: 'Robin Ellis',
        art: 'garden',
        initials: 'ES',
        description:
            'A fiercely competitive community garden becomes the unlikely meeting place for two families who agree on absolutely nothing.',
    },
    {
        id: 'northbound',
        title: 'Northbound',
        year: 2024,
        genre: Genre.Adventure,
        minutes: 118,
        director: 'Casey Reed',
        art: 'mountain',
        initials: 'N',
        description:
            'An overdue train journey takes a photographer through mountain towns, unexpected detours, and the stories she nearly missed.',
    },
    {
        id: 'paper',
        title: 'Paper Planes',
        year: 2025,
        genre: Genre.Drama,
        minutes: 96,
        director: 'Taylor Chen',
        art: 'paper',
        initials: 'PP',
        description:
            'When a neighborhood print shop closes, its last apprentice sets out to finish a book of letters left behind by its customers.',
    },
]
export type Library = {
    saved: string[]
    watched: string[]
    reviews: Record<string, { rating: number; text: string }>
}
export function freshLibrary(): Library {
    return { saved: ['small-hours', 'northbound'], watched: [], reviews: {} }
}
export function toggleFilm(ids: string[], id: string) {
    return ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id]
}
export function filterFilms(input: {
    query: string
    genre: string
    savedOnly: boolean
    library: Library
}) {
    const query = input.query.trim().toLocaleLowerCase()
    return films.filter(
        film =>
            (film.title.toLocaleLowerCase().includes(query) ||
                film.director.toLocaleLowerCase().includes(query)) &&
            (!input.genre || film.genre === input.genre) &&
            (!input.savedOnly || input.library.saved.includes(film.id))
    )
}
export function readLibrary(raw: string | null): Library {
    if (!raw) return freshLibrary()
    try {
        const value: unknown = JSON.parse(raw)
        if (
            !value ||
            typeof value !== 'object' ||
            !('saved' in value) ||
            !('watched' in value) ||
            !('reviews' in value)
        )
            return freshLibrary()
        const validIds = (ids: unknown): ids is string[] =>
            Array.isArray(ids) &&
            ids.every(
                id =>
                    typeof id === 'string' && films.some(film => film.id === id)
            )
        if (
            !validIds(value.saved) ||
            !validIds(value.watched) ||
            !value.reviews ||
            typeof value.reviews !== 'object'
        )
            return freshLibrary()
        const reviews: Library['reviews'] = {}
        for (const [id, review] of Object.entries(value.reviews)) {
            if (
                !films.some(film => film.id === id) ||
                !review ||
                typeof review !== 'object' ||
                !('rating' in review) ||
                !('text' in review) ||
                typeof review.rating !== 'number' ||
                !Number.isInteger(review.rating) ||
                review.rating < 1 ||
                review.rating > 10 ||
                typeof review.text !== 'string' ||
                review.text.length > 2000
            )
                return freshLibrary()
            reviews[id] = { rating: review.rating, text: review.text }
        }
        return {
            saved: [...new Set(value.saved)],
            watched: [...new Set(value.watched)],
            reviews,
        }
    } catch {
        return freshLibrary()
    }
}
