import prisma from '@/prisma'
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { HttpMethods } from 'utils/httpMethods'
import { MovieInput } from '../../../server/movieLists'
import { authOptions } from '../auth/[...nextauth]'

export const movieWithLists = Prisma.validator<Prisma.MovieDefaultArgs>()({
    include: {
        lists: { where: { isPublic: true } },
    },
})

export type MovieWithLists = Prisma.MovieGetPayload<typeof movieWithLists>

export const getMovies = async () =>
    await prisma.movie.findMany({
        ...movieWithLists,
    })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    const session = await getServerSession(req, res, authOptions)

    if (session?.user?.email) {
        try {
            switch (method) {
                case HttpMethods.GET:
                    const dbMovies = await getMovies()
                    res.status(200).json(dbMovies)
                    break
                case HttpMethods.POST:
                    const parsed = MovieInput.safeParse(req.body)
                    if (!parsed.success)
                        return void res
                            .status(400)
                            .json({ error: 'Invalid movie' })
                    const newDbMovie = await prisma.movie.create({
                        data: parsed.data,
                    })
                    res.status(200).json(newDbMovie)
                    break
                default:
                    res.setHeader('Allow', 'GET, POST')
                    return void res
                        .status(405)
                        .json({ error: 'Method not allowed' })
            }
        } catch (err) {
            const errString = `There was an error trying to process user - ${method} movie request - ${err}`

            res.status(403).json({
                error: 'Could not process movie request',
            })
        }
    } else {
        res.status(401).json({
            err: 'You must be authorized to view this endpoint.... Please sign in',
        })
    }
}

export default handler
