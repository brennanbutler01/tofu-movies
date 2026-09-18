import { withVisitorGuard } from 'server/visitor'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import prisma from '@/prisma'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)

    if (session?.user?.userId) {
        const emailInUse = await prisma.user.findUnique({
            where: {
                email: req?.query?.email?.toString().toLowerCase().trim() || '',
            },
        })
        res.status(200).json({ exists: !!emailInUse })
    } else {
        res.status(401).json({
            err: 'You must be authorized to view this api endpoint',
        })
    }
}

export default withVisitorGuard(handler)
