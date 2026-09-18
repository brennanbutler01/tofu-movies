export enum RatingSources {
    IMDB = 'Internet Movie Database',
    RT = 'Rotten Tomatoes',
    META = 'Metacritic',
}

export interface IRating {
    Source?: RatingSources
    Value?: string
}
