import {
    filterFilms,
    freshLibrary,
    readLibrary,
    toggleFilm,
} from '../portfolio/library'
test('search and genre filters combine with the saved collection', () => {
    const library = freshLibrary()
    expect(
        filterFilms({
            query: ' SMALL ',
            genre: 'Drama',
            savedOnly: true,
            library,
        }).map(film => film.id)
    ).toEqual(['small-hours'])
    expect(
        filterFilms({
            query: 'small',
            genre: 'Comedy',
            savedOnly: false,
            library,
        })
    ).toEqual([])
})
test('saving and removing cannot create duplicate entries', () => {
    expect(toggleFilm(toggleFilm([], 'orbit'), 'orbit')).toEqual([])
    expect(
        readLibrary(
            JSON.stringify({
                saved: ['orbit', 'orbit'],
                watched: [],
                reviews: {},
            })
        ).saved
    ).toEqual(['orbit'])
})
test.each([
    'broken',
    '{}',
    '{"saved":[],"watched":[],"reviews":{"orbit":{"rating":11,"text":"x"}}}',
])('invalid browser state resets to disposable fixtures: %s', raw => {
    expect(readLibrary(raw)).toEqual(freshLibrary())
})
test('review and watched status survive a valid state round trip', () => {
    const state = {
        saved: [],
        watched: ['orbit'],
        reviews: { orbit: { rating: 9, text: 'Thoughtful.' } },
    }
    expect(readLibrary(JSON.stringify(state))).toEqual(state)
})
