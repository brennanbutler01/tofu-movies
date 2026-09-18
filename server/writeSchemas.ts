import { z } from 'zod'
import { MovieInput } from './movieLists'
const movieKey = z.object({ tmdb_id: z.number().int().positive() }).strict()
export const MovieRelation = z.union([
    z.object({ connect: movieKey }).strict(),
    z.object({ create: MovieInput }).strict(),
    z
        .object({
            connectOrCreate: z
                .object({ where: movieKey, create: MovieInput })
                .strict(),
        })
        .strict(),
])
export const UserConnection = z
    .object({
        connect: z
            .object({
                id: z.string().min(1).optional(),
                email: z.string().email().optional(),
            })
            .strict(),
    })
    .strict()
export function matchesViewer(
    connection: z.infer<typeof UserConnection> | undefined,
    viewer: { id: string; email?: string | null }
) {
    return (
        !connection ||
        ((!connection.connect.id || connection.connect.id === viewer.id) &&
            (!connection.connect.email ||
                connection.connect.email === viewer.email))
    )
}
export const UserMovieCreate = z
    .object({
        id: z.string().uuid().optional(),
        seen: z.boolean().default(false),
        movie: MovieRelation,
        user: UserConnection.optional(),
    })
    .strict()
export const UserMovieUpdate = z
    .object({ id: z.string().uuid().optional(), seen: z.boolean() })
    .strict()
export const ReviewUpdate = z
    .object({
        title: z.string().trim().min(1).max(200),
        review: z.string().min(1).max(20000),
        rating: z.number().int().min(1).max(10),
    })
    .strict()
export const ReviewCreate = ReviewUpdate.extend({
    id: z.string().uuid().optional(),
    movie: MovieRelation,
    reviewer: UserConnection.optional(),
})
export const ProviderCreate = z
    .object({
        id: z.string().uuid().optional(),
        tmdb_id: z.number().int().positive(),
        logo: z.string().max(2000).nullable().optional(),
        provider_name: z.string().max(200).nullable().optional(),
        linked: z.boolean().default(true),
        user: UserConnection.optional(),
        userId: z.string().optional(),
    })
    .strict()
export const ProviderUpdate = z
    .object({
        id: z.string().uuid().optional(),
        tmdb_id: z.number().int().positive().optional(),
        linked: z.boolean(),
    })
    .strict()
export const ProviderBatch = z
    .object({
        toCreate: z.array(ProviderCreate).max(100),
        toUpdate: z
            .array(ProviderUpdate.extend({ id: z.string().uuid() }))
            .max(100),
    })
    .strict()
