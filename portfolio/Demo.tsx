import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import {
    Film,
    Genre,
    Library,
    films,
    filterFilms,
    freshLibrary,
    readLibrary,
    toggleFilm,
} from './library'
const storageKey = 'tofu-movies-portfolio-v1'
export default function Demo() {
    const [library, setLibrary] = useState<Library>(freshLibrary)
    const [query, setQuery] = useState('')
    const [genre, setGenre] = useState('')
    const [savedOnly, setSavedOnly] = useState(false)
    const [selected, setSelected] = useState<Film | null>(null)
    const [rating, setRating] = useState(8)
    const [review, setReview] = useState('')
    const [notice, setNotice] = useState('')
    const dialog = useRef<HTMLDialogElement>(null)
    useEffect(() => {
        try {
            setLibrary(readLibrary(sessionStorage.getItem(storageKey)))
        } catch {
            setNotice(
                'Browser storage is unavailable. Changes last until you leave this page.'
            )
        }
    }, [])
    function save(next: Library, message: string) {
        setLibrary(next)
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(next))
            setNotice(message)
        } catch {
            setNotice(
                message +
                    ' Browser storage is unavailable; changes will not survive a reload.'
            )
        }
    }
    function openFilm(film: Film) {
        setSelected(film)
        setRating(library.reviews[film.id]?.rating || 8)
        setReview(library.reviews[film.id]?.text || '')
        dialog.current?.showModal()
    }
    function reset() {
        save(freshLibrary(), 'Demo reset. Your sample watchlist is ready.')
        setQuery('')
        setGenre('')
        setSavedOnly(false)
    }
    const results = filterFilms({ query, genre, savedOnly, library })
    return (
        <>
            <Head>
                <title>Tofu.Movies | Find your next film</title>
                <meta
                    name='description'
                    content='Explore a disposable movie-library demo by Brennan Butler. Browse films, build a watchlist, and write a review. No signup required.'
                />
            </Head>
            <div className='demo-banner'>
                PORTFOLIO DEMO{' '}
                <span>
                    Fictional films. Your changes stay in this browser tab.
                </span>
                <button onClick={reset}>Reset demo ↻</button>
            </div>
            <header className='site-header'>
                <a className='brand' href='#'>
                    tofu<span>.</span>movies
                </a>
                <nav aria-label='Library'>
                    <button
                        aria-pressed={!savedOnly}
                        onClick={() => setSavedOnly(false)}
                    >
                        Discover
                    </button>
                    <button
                        aria-pressed={savedOnly}
                        onClick={() => setSavedOnly(true)}
                    >
                        My watchlist{' '}
                        <span className='count'>{library.saved.length}</span>
                    </button>
                </nav>
                <span className='profile' aria-label='Demo viewer'>
                    BB
                </span>
            </header>
            <main>
                <section className='hero' aria-labelledby='hero-title'>
                    <div className='hero-copy'>
                        <p className='eyebrow'>LESS SCROLLING. MORE CINEMA.</p>
                        <h1 id='hero-title'>
                            Make tonight
                            <br />a movie night<span>.</span>
                        </h1>
                        <p>
                            Your next favorite is out there. Find it, save it,
                            and keep a little record of what stayed with you.
                        </p>
                        <a className='primary' href='#collection'>
                            Explore the collection{' '}
                            <span aria-hidden='true'>↗</span>
                        </a>
                        <div className='hero-note'>
                            A small collection. A few good stories.
                        </div>
                    </div>
                    <button
                        className='feature sunset'
                        onClick={() => openFilm(films[0])}
                        aria-label='Explore The Last Light'
                    >
                        <span className='feature-label'>THE EVENING PICK</span>
                        <div className='sun' />
                        <span className='feature-bottom'>
                            <span className='eyebrow'>
                                2025 / ADVENTURE / 112 MIN
                            </span>
                            <strong>
                                The Last
                                <br />
                                Light
                            </strong>
                            <span className='feature-action'>
                                Explore this film ↗
                            </span>
                        </span>
                    </button>
                </section>
                <section id='collection' aria-labelledby='collection-title'>
                    <div className='section-heading'>
                        <div>
                            <p className='eyebrow'>YOUR OWN LITTLE CINEMA</p>
                            <h2 id='collection-title'>
                                {savedOnly
                                    ? 'Your watchlist'
                                    : 'Find something worth watching'}
                            </h2>
                        </div>
                        <span className='result-count'>
                            {results.length}{' '}
                            {results.length === 1 ? 'film' : 'films'}
                        </span>
                    </div>
                    <div className='filters'>
                        <label className='search'>
                            <span aria-hidden='true'>⌕</span>
                            <input
                                aria-label='Search films'
                                placeholder='Search films or directors'
                                value={query}
                                onChange={event => setQuery(event.target.value)}
                            />
                        </label>
                        <div className='genres' aria-label='Filter by genre'>
                            <button
                                aria-pressed={genre === ''}
                                onClick={() => setGenre('')}
                            >
                                All films
                            </button>
                            {Object.values(Genre).map(value => (
                                <button
                                    key={value}
                                    aria-pressed={genre === value}
                                    onClick={() => setGenre(value)}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div role='status' className='notice'>
                        {notice}
                    </div>
                    {results.length ? (
                        <div className='film-grid'>
                            {results.map(film => (
                                <article className='film' key={film.id}>
                                    <button
                                        className={'poster ' + film.art}
                                        onClick={() => openFilm(film)}
                                        aria-label={'View ' + film.title}
                                    >
                                        <span className='poster-year'>
                                            {film.year}
                                        </span>
                                        <span
                                            className='poster-mark'
                                            aria-hidden='true'
                                        >
                                            {film.initials}
                                        </span>
                                        <span className='poster-title'>
                                            {film.title}
                                        </span>
                                        <span className='poster-caption'>
                                            A FILM BY{' '}
                                            {film.director.toUpperCase()}
                                        </span>
                                    </button>
                                    <div className='film-heading'>
                                        <button
                                            className='film-title'
                                            onClick={() => openFilm(film)}
                                        >
                                            {film.title}
                                        </button>
                                        <button
                                            className='save-button'
                                            aria-label={
                                                (library.saved.includes(film.id)
                                                    ? 'Remove '
                                                    : 'Save ') +
                                                film.title +
                                                (library.saved.includes(film.id)
                                                    ? ' from watchlist'
                                                    : ' to watchlist')
                                            }
                                            aria-pressed={library.saved.includes(
                                                film.id
                                            )}
                                            onClick={() =>
                                                save(
                                                    {
                                                        ...library,
                                                        saved: toggleFilm(
                                                            library.saved,
                                                            film.id
                                                        ),
                                                    },
                                                    library.saved.includes(
                                                        film.id
                                                    )
                                                        ? 'Removed from your watchlist.'
                                                        : 'Saved to your watchlist.'
                                                )
                                            }
                                        >
                                            {library.saved.includes(film.id)
                                                ? '✓'
                                                : '+'}
                                        </button>
                                    </div>
                                    <p className='film-meta'>
                                        {film.genre} <span>·</span>{' '}
                                        {film.minutes} min{' '}
                                        {library.watched.includes(film.id) && (
                                            <b>· Watched</b>
                                        )}
                                    </p>
                                    {library.reviews[film.id] && (
                                        <p className='your-rating'>
                                            Your rating:{' '}
                                            {library.reviews[film.id].rating}/10
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className='empty'>
                            <h3>No films here yet.</h3>
                            <p>
                                {savedOnly
                                    ? 'Save a film from Discover, or clear your filters.'
                                    : 'Try a different title or clear your filters.'}
                            </p>
                            <button
                                className='secondary'
                                onClick={() => {
                                    setQuery('')
                                    setGenre('')
                                    setSavedOnly(false)
                                }}
                            >
                                Show all films
                            </button>
                        </div>
                    )}
                </section>
            </main>
            <footer>
                <a href='#' className='brand'>
                    tofu<span>.</span>movies
                </a>
                <p>
                    A movie-library project by Brennan Butler.
                    <br />
                    This demo uses fictional titles and disposable, per-tab
                    data.
                </p>
                <span>BUILT FOR THE LOVE OF FILM</span>
            </footer>
            <dialog ref={dialog} aria-labelledby='detail-title'>
                <button
                    className='close'
                    onClick={() => dialog.current?.close()}
                    aria-label='Close film details'
                >
                    ×
                </button>
                {selected && (
                    <div className='detail'>
                        <p className='eyebrow'>
                            {selected.year} / {selected.genre} /{' '}
                            {selected.minutes} MIN
                        </p>
                        <h2 id='detail-title'>{selected.title}</h2>
                        <p className='director'>
                            Directed by {selected.director}
                        </p>
                        <p>{selected.description}</p>
                        <button
                            className='secondary'
                            onClick={() =>
                                save(
                                    {
                                        ...library,
                                        watched: toggleFilm(
                                            library.watched,
                                            selected.id
                                        ),
                                    },
                                    'Watch status updated.'
                                )
                            }
                            aria-pressed={library.watched.includes(selected.id)}
                        >
                            {library.watched.includes(selected.id)
                                ? '✓ Watched'
                                : 'Mark as watched'}
                        </button>
                        <form
                            onSubmit={event => {
                                event.preventDefault()
                                save(
                                    {
                                        ...library,
                                        reviews: {
                                            ...library.reviews,
                                            [selected.id]: {
                                                rating,
                                                text: review.trim(),
                                            },
                                        },
                                    },
                                    'Your review was saved.'
                                )
                                dialog.current?.close()
                            }}
                        >
                            <h3>Your take</h3>
                            <label>
                                Rating{' '}
                                <select
                                    aria-label='Your rating'
                                    value={rating}
                                    onChange={event =>
                                        setRating(Number(event.target.value))
                                    }
                                >
                                    {Array.from(
                                        { length: 10 },
                                        (_, index) => index + 1
                                    ).map(value => (
                                        <option key={value} value={value}>
                                            {value} / 10
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Your review
                                <textarea
                                    maxLength={2000}
                                    rows={4}
                                    value={review}
                                    onChange={event =>
                                        setReview(event.target.value)
                                    }
                                    placeholder='What stayed with you?'
                                />
                            </label>
                            <button className='primary' type='submit'>
                                Save review
                            </button>
                        </form>
                    </div>
                )}
            </dialog>
        </>
    )
}
