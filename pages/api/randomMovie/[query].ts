import { withProviderAccess } from 'server/providerAccess'
import { NextApiRequest, NextApiResponse } from 'next'
import randomWords from 'random-words'
import { randomIntFromInterval } from 'utils/randomIntFromInterval'
import { movieSearch } from '../search/[...params]'

const getRandomMovie = async (query: string) => {
    for (let attempt = 0; attempt < 3; attempt++) {
        const movie = await movieSearch(
            attempt === 0 ? query : randomWords(1).join('')
        )
        if (movie?.results?.length)
            return movie.results[
                randomIntFromInterval(0, movie.results.length - 1)
            ]
    }
    return null
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.query
    try {
        const movie = await getRandomMovie(query as string)
        console.log('movie', movie)
        res.status(200).json(movie)
    } catch (err) {
        res.status(403).json({ err: 'Error getting random movie - ' + err })
    }
}
export default withProviderAccess(handler)
