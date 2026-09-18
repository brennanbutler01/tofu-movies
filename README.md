# Tofu.Movies

A movie discovery and watchlist project built with TypeScript, React, Next.js, Prisma and PostgreSQL.

**[Try the portfolio demo](https://tofu-movies-demo.vercel.app)** · [Reviewer guide](REVIEW.md) · [Recovery status](RECOVERY.md)

The application now includes a no-signup mode backed by PostgreSQL: private visitor watchlists, watched status, editable lists and reviews, reactions, and reset. It uses three clearly labeled fictional films. Sessions last one hour; live catalogue services, Google sign-in and uploads are disabled in this mode.

See [Visitor demo setup and verification](VISITOR-DEMO.md) for the build, local database, hosted configuration, isolation limits and tests. Deployment of this persisted edition is being verified; the URL above may still serve the prior static edition until that verification completes.

## Development

Use Node 24 and pinned Yarn through Corepack:

```sh
corepack yarn install --frozen-lockfile --ignore-scripts
corepack yarn prisma generate
corepack yarn local:setup
corepack yarn typecheck
corepack yarn test
```

Docker setup creates a disposable PostgreSQL database on loopback port 5199 and a gitignored environment file with a generated secret. It refuses other database addresses.

The normal application mode preserves the original provider integrations. `corepack yarn test:local` exercises 60 real HTTP/database checks against a local server on port 5198, with temporary database sessions and cleanup. Set `LOCAL_API_URL` to use another loopback port. These tests do not require a login bypass or original credentials.

The previous standalone static demo remains in `portfolio-site/`. Its build and browser tests use `build:portfolio` and `test:portfolio`.

## Security and publication

This repository has a clean independent publication history. The application recovery adds ownership checks, validated writes, and safe list reads. New hosting uses a separate database and newly generated session credentials. Removing old secrets from published source does not revoke credentials at their original providers.

## Original project

Original features include catalogue search through The Movie Database and OMDb, streaming-provider information, movie reviews, shared lists and watch tracking. The public demo is a separate, limited demonstration with fictional data; it does not present those integrations as live.

Original catalogue credits: [The Movie Database](https://www.themoviedb.org/), [OMDb](https://www.omdbapi.com/), and [JustWatch](https://www.justwatch.com/).

See [LICENSE.md](LICENSE.md) for the original license.
