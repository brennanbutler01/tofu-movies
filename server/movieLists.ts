import { Prisma } from '@prisma/client'
import { z } from 'zod'
import prisma from '@/prisma'

export const fullMovieList = Prisma.validator<Prisma.MovieListDefaultArgs>()({
    include: { movies: true, users: { select: { id: true } } },
})
export type FullMovieList = Prisma.MovieListGetPayload<typeof fullMovieList>
export type Viewer = { id: string; email: string }

export function ownsList(list: FullMovieList, viewer: Viewer) {
    return (
        list.createdBy === viewer.email ||
        (list.createdBy === 'System Generated' &&
            list.users.length === 1 &&
            list.users[0].id === viewer.id)
    )
}
export function canReadList(list: FullMovieList, viewer: Viewer) {
    if (process.env.VISITOR_DEMO === 'true') return ownsList(list, viewer)
    return (
        list.isPublic ||
        ownsList(list, viewer) ||
        list.users.some(user => user.id === viewer.id)
    )
}
export function canEditListMovies(list: FullMovieList, viewer: Viewer) {
    return (
        ownsList(list, viewer) ||
        (list.allowEdits && list.users.some(user => user.id === viewer.id))
    )
}
export async function getMovieList(id: string, viewer: Viewer) {
    const list = await prisma.movieList.findUnique({
        where: { id },
        ...fullMovieList,
    })
    return list && canReadList(list, viewer) ? list : null
}
export const getUserMovieLists = (email: string | null | undefined) =>
    !email
        ? Promise.resolve([])
        : prisma.movieList.findMany({
              where: { users: { some: { email } } },
              ...fullMovieList,
              orderBy: { title: 'asc' },
          })

const text = z.string().max(20000).nullable().optional()
const image = z
    .union([
        z.literal(''),
        z
            .string()
            .url()
            .refine(value => new URL(value).protocol === 'https:'),
    ])
    .nullable()
    .optional()
const reference = z.object({ tmdb_id: z.number().int().positive() }).strict()
const referenceSet = z.union([reference, z.array(reference).max(100)])
export const MovieInput = z
    .object({
        id: z.string().uuid().optional(),
        tmdb_id: z.number().int().positive(),
        title: text,
        original_title: text,
        imdb_id: text,
        backdrop: image,
        poster: image,
        overview: text,
        tagline: text,
        release_date: text,
        plot: text,
        awards: text,
        box_office: text,
        maturity_rating: text,
        genre: z.array(z.string()).max(100).optional(),
        director: z.array(z.string()).max(100).optional(),
        writers: z.array(z.string()).max(1000).optional(),
        actors: z.array(z.string()).max(1000).optional(),
        created: z.string().datetime().optional(),
        ratings: z
            .object({
                createMany: z
                    .object({
                        data: z
                            .array(
                                z
                                    .object({
                                        id: z.string().uuid(),
                                        source: z.string().max(200),
                                        value: z.string().max(200),
                                    })
                                    .strict()
                            )
                            .max(100),
                    })
                    .strict(),
            })
            .strict()
            .optional(),
    })
    .strict()
const membership = z.object({ email: z.string().email() }).strict()
const fields = {
    id: z.string().uuid().optional(),
    title: z.string().trim().min(1).max(100).optional(),
    description: z.string().max(2000).optional(),
    image,
    isPublic: z.boolean().optional(),
    allowEdits: z.boolean().optional(),
    created: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    createdBy: z.string().optional(),
    movies: z
        .object({
            connect: referenceSet.optional(),
            disconnect: referenceSet.optional(),
            create: z
                .union([MovieInput, z.array(MovieInput).max(100)])
                .optional(),
        })
        .strict()
        .optional(),
    users: z
        .object({
            connect: membership.optional(),
            disconnect: membership.optional(),
        })
        .strict()
        .optional(),
    views: z.number().int().nonnegative().optional(),
}
export const ListUpdate = z.object(fields).strict()
export const ListCreate = ListUpdate.extend({
    title: fields.title.unwrap(),
    description: fields.description.unwrap(),
})
export function metadata(input: z.infer<typeof ListUpdate>) {
    return {
        title: input.title,
        description: input.description,
        image: input.image,
        isPublic: input.isPublic,
        allowEdits: input.allowEdits,
    }
}
