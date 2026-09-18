import {
    ProviderBatch,
    ReviewCreate,
    UserMovieCreate,
    UserMovieUpdate,
} from '../server/writeSchemas'
import { reviewHtml } from '../utils/reviewHtml'
test('untrusted nested database mutations are rejected', () => {
    expect(
        UserMovieCreate.safeParse({
            movie: { connect: { tmdb_id: 1 }, delete: true },
        }).success
    ).toBe(false)
    expect(
        UserMovieUpdate.safeParse({
            seen: true,
            user: { update: { role: 'ADMIN' } },
        }).success
    ).toBe(false)
    expect(
        ProviderBatch.safeParse({
            toCreate: [],
            toUpdate: [{ id: 'x', linked: true, userId: 'other' }],
        }).success
    ).toBe(false)
    expect(
        ReviewCreate.safeParse({
            title: 'test',
            review: 'test',
            rating: 12,
            movie: { connect: { tmdb_id: 1 } },
        }).success
    ).toBe(false)
})
test('review formatting cannot introduce scripts, event handlers or remote resources', () => {
    expect(
        reviewHtml(
            '<p>Hello <strong>world</strong></p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">click</a>'
        )
    ).toBe('<p>Hello <strong>world</strong></p>click')
})
