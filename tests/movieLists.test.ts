import {
    canReadList,
    canEditListMovies,
    ownsList,
    FullMovieList,
    ListUpdate,
} from '../server/movieLists'
const owner = { id: 'owner', email: 'owner@example.invalid' }
const member = { id: 'member', email: 'member@example.invalid' }
const stranger = { id: 'stranger', email: 'stranger@example.invalid' }
const list: FullMovieList = {
    id: 'list',
    title: 'Fixture',
    description: '',
    created: new Date(),
    updatedAt: new Date(),
    isPublic: false,
    allowEdits: true,
    image: null,
    ownerId: null,
    createdBy: owner.email,
    views: 0,
    movies: [],
    users: [{ id: owner.id }, { id: member.id }],
}
test('private lists are readable only by their owner and members', () => {
    expect(canReadList(list, owner)).toBe(true)
    expect(canReadList(list, member)).toBe(true)
    expect(canReadList(list, stranger)).toBe(false)
})
test('public visibility does not grant write access', () => {
    expect(canReadList({ ...list, isPublic: true }, stranger)).toBe(true)
    expect(canEditListMovies({ ...list, isPublic: true }, stranger)).toBe(false)
    expect(canEditListMovies(list, member)).toBe(true)
    expect(canEditListMovies({ ...list, allowEdits: false }, member)).toBe(
        false
    )
    expect(canEditListMovies({ ...list, allowEdits: false }, owner)).toBe(true)
})
test('legacy system lists only infer ownership for a sole member', () => {
    expect(ownsList({ ...list, createdBy: 'System Generated' }, member)).toBe(
        false
    )
    expect(
        ownsList(
            {
                ...list,
                createdBy: 'System Generated',
                users: [{ id: owner.id }],
            },
            owner
        )
    ).toBe(true)
})
test('nested arbitrary database mutations are rejected', () => {
    expect(ListUpdate.safeParse({ users: { deleteMany: {} } }).success).toBe(
        false
    )
    expect(ListUpdate.safeParse({ movies: { updateMany: {} } }).success).toBe(
        false
    )
    expect(ListUpdate.safeParse({ image: 'javascript:alert(1)' }).success).toBe(
        false
    )
})
