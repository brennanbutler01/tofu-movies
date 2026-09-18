import { z } from 'zod'
import { MovieRelation } from 'server/writeSchemas'

export function visitorMovieRelation(movie: z.infer<typeof MovieRelation>) {
    if (process.env.VISITOR_DEMO !== 'true') return movie
    // Visitor writes may reference the seeded catalogue but never create shared catalogue data.
    const tmdb_id =
        'connect' in movie
            ? movie.connect.tmdb_id
            : 'connectOrCreate' in movie
            ? movie.connectOrCreate.where.tmdb_id
            : movie.create.tmdb_id
    return { connect: { tmdb_id } }
}
