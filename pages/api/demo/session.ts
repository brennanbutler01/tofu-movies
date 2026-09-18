import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma'
import { deleteOwnedUser } from 'server/deleteOwnedUser'
import {
    createVisitor,
    findVisitor,
    isSameOrigin,
    visitorCookie,
    visitorEnabled,
} from 'server/visitor'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Cache-Control', 'no-store')
    if (!visitorEnabled) return void res.status(404).end()
    if (!['GET', 'POST', 'DELETE'].includes(req.method || ''))
        return void res.status(405).end()
    if (req.method !== 'GET' && !isSameOrigin(req))
        return void res
            .status(403)
            .json({ err: 'Same-origin request required.' })
    const existing = await findVisitor(req)
    if (req.method === 'GET')
        return void (existing
            ? res.json({ userId: existing.userId, expiresAt: existing.expires })
            : res.status(401).end())
    if (req.method === 'DELETE') {
        if (existing)
            await prisma.$transaction(tx =>
                deleteOwnedUser(tx, existing.userId)
            )
        res.setHeader('Set-Cookie', visitorCookie('', true))
        return void res.status(204).end()
    }
    if (existing)
        return void res.json({
            userId: existing.userId,
            expiresAt: existing.expires,
        })
    const visitor = await createVisitor()
    if (!visitor)
        return void res
            .status(503)
            .json({ err: 'The demo is busy. Please try again later.' })
    res.setHeader('Set-Cookie', visitorCookie(visitor.token))
    return void res.json({
        userId: visitor.userId,
        expiresAt: visitor.expiresAt,
    })
}
