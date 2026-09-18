import { sampleMovies } from 'server/sampleCatalogue'
import { randomBytes, randomUUID } from 'node:crypto'
import type { NextApiHandler, NextApiRequest } from 'next'
import prisma from '@/prisma'
import { deleteOwnedUser } from 'server/deleteOwnedUser'

export const visitorEnabled = process.env.VISITOR_DEMO === 'true'
export const visitorCookieName = process.env.NEXTAUTH_URL?.startsWith('https:')
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'
const lifetime = 60 * 60 * 1000

export function isSameOrigin(req: NextApiRequest) {
    return (
        Boolean(process.env.NEXTAUTH_URL) &&
        req.headers.origin === new URL(process.env.NEXTAUTH_URL!).origin
    )
}

export function visitorCookie(token: string, reset = false) {
    return `${visitorCookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
        reset ? 0 : 3600
    }${visitorCookieName.startsWith('__Secure-') ? '; Secure' : ''}`
}

export async function findVisitor(req: NextApiRequest) {
    const token = req.cookies[visitorCookieName]
    if (!token) return null
    const session = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: { user: { include: { demoVisit: true } } },
    })
    const visit = session?.user.demoVisit
    return session &&
        visit &&
        visit.expiresAt > new Date() &&
        session.expires > new Date()
        ? session
        : null
}

export async function createVisitor() {
    return prisma.$transaction(
        async tx => {
            // Serialize capacity checks across concurrent serverless instances.
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(51985198)`
            const expired = await tx.demoVisit.findMany({
                where: { expiresAt: { lte: new Date() } },
                take: 100,
            })
            for (const visit of expired) await deleteOwnedUser(tx, visit.userId)
            if ((await tx.demoVisit.count()) >= 100) return null
            const userId = 'visitor-' + randomUUID()
            const token = randomBytes(32).toString('hex')
            const expiresAt = new Date(Date.now() + lifetime)
            await tx.user.create({
                data: {
                    id: userId,
                    name: 'Demo movie fan',
                    email: userId + '@example.invalid',
                    sessions: {
                        create: { sessionToken: token, expires: expiresAt },
                    },
                    demoVisit: { create: { expiresAt } },
                },
            })
            for (const movie of sampleMovies) {
                if (!movie.id) continue
                await tx.movie.upsert({
                    where: { tmdb_id: movie.id },
                    update: {},
                    create: {
                        tmdb_id: movie.id,
                        title: movie.title,
                        original_title: movie.original_title,
                        overview: movie.overview,
                        tagline: movie.tagline,
                        release_date: movie.release_date,
                        genre:
                            movie.genres?.map(genre => genre.name || '') || [],
                        director: [],
                        writers: [],
                        actors: [],
                    },
                })
            }
            await tx.movieList.create({
                data: {
                    title: 'Watchlist',
                    description: 'Your demo watchlist',
                    createdBy: userId + '@example.invalid',
                    ownerId: userId,
                    users: { connect: { id: userId } },
                },
            })

            return { userId, token, expiresAt }
        },
        { timeout: 15000 }
    )
}

export function withVisitorGuard(handler: NextApiHandler): NextApiHandler {
    return async (req, res) => {
        if (!visitorEnabled) {
            await handler(req, res)
            return
        }
        res.setHeader('Cache-Control', 'no-store')
        if (!['GET', 'HEAD'].includes(req.method || '') && !isSameOrigin(req))
            return res
                .status(403)
                .json({ error: 'Same-origin request required.' })
        const session = await findVisitor(req)
        if (!session)
            return res
                .status(401)
                .json({ error: 'Demo session expired. Start a new demo.' })
        const writeBytes = req.body
            ? Buffer.byteLength(JSON.stringify(req.body))
            : 0
        if (writeBytes > 16384)
            return res.status(413).json({ error: 'Demo request is too large.' })
        const budget = await prisma.demoVisit.updateMany({
            where: {
                userId: session.userId,
                expiresAt: { gt: new Date() },
                requests: { lt: 1000 },
                writeBytes: { lte: 500000 - writeBytes },
            },
            data: {
                requests: { increment: 1 },
                writeBytes: { increment: writeBytes },
            },
        })
        if (!budget.count)
            return res.status(429).json({
                err: 'Demo request limit reached. Reset the demo to continue.',
            })
        if ((req.url || '').split('?')[0] === '/api/uploadImage')
            return res
                .status(503)
                .json({ error: 'Image uploads are unavailable in this demo.' })

        await handler(req, res)
    }
}
