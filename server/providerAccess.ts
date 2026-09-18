import type { NextApiHandler } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export function withProviderAccess(
    handler: NextApiHandler,
    provider: 'movie' | 'omdb' = 'movie'
): NextApiHandler {
    return async (request, response) => {
        if (request.method !== 'GET')
            return response.status(405).json({ error: 'Method not allowed.' })
        if (
            !(await getServerSession(request, response, authOptions))?.user
                ?.userId
        )
            return response.status(401).json({ error: 'Please sign in.' })
        if (
            !(provider === 'movie'
                ? process.env.MOVIE_KEY
                : process.env.OMDB_KEY)
        )
            return response
                .status(503)
                .json({ error: 'Movie information is not configured.' })
        try {
            await handler(request, response)
        } catch {
            if (!response.headersSent)
                response
                    .status(502)
                    .json({
                        error: 'Movie information is temporarily unavailable.',
                    })
        }
    }
}
