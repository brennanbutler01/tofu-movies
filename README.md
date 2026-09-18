# Tofu.Movies

A movie discovery and watchlist project built with TypeScript, React, Next.js, Prisma and PostgreSQL.

**[Try the portfolio demo](https://tofu-movies-demo.vercel.app)** · [Reviewer guide](REVIEW.md) · [Recovery status](RECOVERY.md)

The public demo lets visitors search fictional films, filter by genre, manage a watchlist, mark films watched, and save ratings and reviews. It needs no signup or provider credentials. State stays in the current browser tab and can be reset at any time.

The original application integrates movie catalogues, Google sign-in, shared lists, and PostgreSQL. The September 2026 recovery fixes a destructive list-read bug and adds permissions and input validation to list, profile, and review-update routes. The original authenticated backend remains local-only while the remaining audit work is completed.

## Run the demo

Use Node 24.13.0 and the pinned Yarn version through Corepack:

```sh
corepack yarn install --frozen-lockfile --ignore-scripts
corepack yarn prisma generate
corepack yarn typecheck
corepack yarn test
corepack yarn build:portfolio
corepack yarn test:portfolio
python3 -m http.server 5200 --bind 127.0.0.1 --directory portfolio-site/out
```

Open http://127.0.0.1:5200. No environment file or database is required for the demo.

## Test the original backend locally

Docker is required. Setup creates only a disposable PostgreSQL database on `127.0.0.1:5199`, plus a gitignored `.env.local` with a generated session secret. It refuses any other database address.

```sh
corepack yarn local:setup
corepack yarn dev --hostname 127.0.0.1 --port 5198
# In another terminal:
corepack yarn test:local
```

The HTTP tests create temporary users, sessions, lists, films and reviews, then delete their fixtures. They exercise the real Next.js handlers and PostgreSQL, with no login-bypass endpoint or old credentials. Google login and live catalogue calls need separately provisioned provider credentials; they are not needed for these tests.

## Deployment boundary

`corepack yarn deploy:portfolio` builds and tests the demo, then uploads only the static export to the dedicated personal Vercel project. It does not deploy the original backend, source tree, historical assets or environment files. The project has no provider secrets and no Git-triggered deployment connection.

Repository publication remains pending the credential-history cleanup and historical asset review described in [RECOVERY.md](RECOVERY.md).

## Original project

Original features include catalogue search through The Movie Database and OMDb, streaming-provider information, movie reviews, shared lists and watch tracking. The public demo is a separate, limited demonstration with fictional data; it does not present those integrations as live.

Original catalogue credits: [The Movie Database](https://www.themoviedb.org/), [OMDb](https://www.omdbapi.com/), and [JustWatch](https://www.justwatch.com/).

See [LICENSE.md](LICENSE.md) for the original license.
