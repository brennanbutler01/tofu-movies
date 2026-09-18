import prisma from '@/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { fullMovieList } from '..'

export const getPublicMovieLists = async () =>
    await prisma.movieList.findMany({
        where: {
            isPublic: true,
        },
        ...fullMovieList,
        orderBy: {
            title: 'asc',
        },
    })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    const session = await getServerSession(req, res, authOptions)

    if (session?.user?.email) {
        try {
            const publicMovieLists = await getPublicMovieLists()
            res.status(200).json(publicMovieLists)
        } catch (err) {
            const errString =
                'Error trying to complete ' + method + ' request. ' + err
            console.log(errString)
            res.status(403).json({
                err: errString,
            })
        }
    } else {
        res.status(401).json({
            err: 'You must be authenticated to view this api endpoint, please sign in!',
        })
    }
}

export default handler
