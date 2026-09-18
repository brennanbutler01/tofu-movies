import { withVisitorGuard } from 'server/visitor'
import { withProviderAccess } from 'server/providerAccess'
import prisma from '@/prisma'
import { ImageConfig } from '@prisma/client'
import axios from 'server/providerHttp'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

export interface IConfig {
    base_url: string
    poster_sizes: Array<string>
    logo_sizes: Array<string>
    profile_sizes: Array<string>
    backdrop_sizes: Array<string>
    still_sizes: Array<string>
}

const CONFIG_URL = 'https://api.themoviedb.org/3/configuration'

const updatedMoreThanTwoDaysAgo = (imageConfig: ImageConfig) => {
    const updated = dayjs(imageConfig?.updatedAt)
    const now = dayjs(new Date())
    const lastUpdatedFromNow = now.diff(updated, 'days')
    return lastUpdatedFromNow >= 2
}

const getConfig = async () =>
    await axios
        .get(CONFIG_URL, {
            params: {
                api_key: process.env.MOVIE_KEY,
            },
        })
        .then(res => {
            const {
                data: {
                    images: {
                        secure_base_url: base_url,
                        poster_sizes,
                        logo_sizes,
                        backdrop_sizes,
                        profile_sizes,
                        still_sizes,
                    },
                },
            } = res
            return {
                base_url,
                poster_sizes,
                logo_sizes,
                backdrop_sizes,
                profile_sizes,
                still_sizes,
            }
        })
        .catch(() => {
            throw new Error('Movie information is temporarily unavailable.')
        })

const updateDbConfig = async (props: IConfig) =>
    await prisma.imageConfig.update({
        where: { id: 0 },
        data: {
            updatedAt: new Date(),
            ...props,
        },
    })

const getDbConfig = async () =>
    await prisma.imageConfig.findUnique({ where: { id: 0 } })

const createImageConfig = async (props: IConfig) =>
    await prisma.imageConfig.create({
        data: {
            id: 0,
            ...props,
            updatedAt: new Date(),
        },
    })

export const getImageUrl = async (): Promise<IConfig | void> => {
    if (process.env.VISITOR_DEMO === 'true' || !process.env.MOVIE_KEY)
        return {
            base_url: 'https://image.tmdb.org/t/p/',
            poster_sizes: ['w500'],
            logo_sizes: ['w185'],
            profile_sizes: ['w185'],
            backdrop_sizes: ['w780'],
            still_sizes: ['w300'],
        }
    const dbConfigRecord = await getDbConfig()

    if (dbConfigRecord) {
        console.log('has')
        const { id, updatedAt, ...cachedConfig } = dbConfigRecord
        //if we had an update more than two days ago
        if (updatedMoreThanTwoDaysAgo(dbConfigRecord)) {
            const config = await getConfig()
            //we need to get a new config and update
            if (config) {
                await updateDbConfig({
                    ...config,
                })
                return config
            }
            console.log('more than two ago...')
        }
        console.log('returning cached')
        return cachedConfig
    }

    console.log('getting full config because no record')

    const config = await getConfig()

    if (config) {
        await createImageConfig(config)
    }

    return config
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const config = await getImageUrl()
        res.status(200).json(config)
    } catch (err) {
        res.status(403).json({ err: 'Error trying to get config ' + err })
    }
}

export default withVisitorGuard(withProviderAccess(handler))
