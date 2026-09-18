import { withProviderAccess } from 'server/providerAccess'
import axios from 'server/providerHttp'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { IProviderDetails } from './[id]'

interface IProviderData {
    results: IProviderDetails[]
}

const getProviders = async () =>
    await axios
        .get<IProviderData>(
            'https://api.themoviedb.org/3/watch/providers/movie',
            {
                params: {
                    api_key: process.env.MOVIE_KEY,
                    watch_region: 'US',
                },
            }
        )
        .then(res => res.data.results)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)

    if (session?.user?.userId) {
        const providers = await getProviders()
        console.log(providers)
        res.status(200).json(providers)
    } else {
        res.status(401).json({
            err: 'You must be authenticated to view this api endpoint',
        })
    }
}

export default withProviderAccess(handler)
