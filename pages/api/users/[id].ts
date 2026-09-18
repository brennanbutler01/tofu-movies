import { withVisitorGuard } from 'server/visitor'
import prisma from '@/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '../auth/[...nextauth]'

const ProfileUpdate = z
    .object({
        name: z.string().trim().min(1).max(100).optional(),
        image: z
            .union([
                z.literal(''),
                z
                    .string()
                    .url()
                    .refine(value => new URL(value).protocol === 'https:'),
            ])
            .optional(),
        email: z.string().email().optional(),
    })
    .strict()
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.userId)
        return void res.status(401).json({ error: 'Sign in required' })
    if (session.user.userId !== req.query.id)
        return void res
            .status(403)
            .json({ error: 'You can only access your own profile' })
    try {
        if (req.method === 'GET')
            return void res.status(200).json(
                await prisma.user.findUnique({
                    where: { id: session.user.userId },
                })
            )
        if (req.method !== 'PUT') {
            res.setHeader('Allow', 'GET, PUT')
            return void res.status(405).json({ error: 'Method not allowed' })
        }
        const parsed = ProfileUpdate.safeParse(req.body)
        if (
            !parsed.success ||
            (parsed.data.email && parsed.data.email !== session.user.email)
        )
            return void res.status(400).json({
                error: 'Invalid profile update. Email changes require verification.',
            })
        const { name, image } = parsed.data
        return void res.status(200).json(
            await prisma.user.update({
                where: { id: session.user.userId },
                data: { name, image },
            })
        )
    } catch {
        return void res.status(500).json({ error: 'Could not update profile' })
    }
}

export default withVisitorGuard(handler)
