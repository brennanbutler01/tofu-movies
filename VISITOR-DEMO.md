# Persisted visitor demo

The application supports a no-signup portfolio mode with a real PostgreSQL backend. The fictional three-film catalogue is shared and read-only. Each visitor gets private lists, watch history, reviews, profile data and reactions. Even lists marked public remain isolated in visitor mode.

## Boundaries

-   Opaque HttpOnly, SameSite cookies expire after one hour. Hosted cookies require HTTPS.
-   Mutations require the configured origin. Database sessions and visitor expiry are checked on each API request.
-   Each visitor has a persisted 1,000-request and 500 KB write budget; individual JSON payloads are limited to 16 KiB. Global capacity is 100 sessions, serialized through a database advisory lock.
-   Reset deletes the visitor and owned records using foreign-key cascades. Expired records are cleaned when a new visitor starts. Expiry blocks access immediately; this is not a continuously running deletion scheduler.
-   Shared film creation and uploads are denied. Google sign-in and external catalogue services are unavailable in visitor mode. No original credentials are needed.

## Local verification

Use Node 24 and the pinned Yarn version. `corepack yarn local:setup` prepares the disposable database on port 5199.

```sh
VISITOR_DEMO=true NEXT_PUBLIC_VISITOR_DEMO=true NEXTAUTH_URL=http://127.0.0.1:5218 corepack yarn build
VISITOR_DEMO=true NEXT_PUBLIC_VISITOR_DEMO=true NEXTAUTH_URL=http://127.0.0.1:5218 corepack yarn start --hostname 127.0.0.1 --port 5218
# In another terminal:
corepack yarn test:visitor-api
corepack yarn test:visitor-lifecycle
corepack yarn test:visitor
```

Browser tests cover desktop/mobile list creation and editing, failed-save recovery, watchlists, watched status, review creation and editing, reactions, reload persistence and reset. HTTP tests use separate cookie jars to check isolation, including rendered pages. Lifecycle tests inspect physical deletion, concurrent reset/write behavior, expiry and request limits; they refuse a hosted database.

For hosted checks, set `VISITOR_URL` to the deployed site for `test:visitor-api` and `test:visitor`. Never run lifecycle tests against hosting.

## Hosting

Deploy only to the personal `tofu-movies-demo` Vercel project with the dedicated `tofu-movies-demo-db` Neon database. Server-only variables are `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` and `VISITOR_DEMO=true`. The build also needs `NEXT_PUBLIC_VISITOR_DEMO=true`, which contains no credential. The schema is applied explicitly to the dedicated demo database, never automatically during deployment.

`corepack yarn deploy:visitor` stages tracked application source outside Git and uploads it to the linked personal project. Review and scan source before deployment. The previous static edition remains under `portfolio-site/` for reference; it is not the persisted application.

Publication and history cleanup do not revoke old external credentials. Provider access requires separately provisioned credentials and verification.

## Hosted module compatibility

The sanitizer currently depends on an ESM-only parser through a CommonJS entrypoint. Vercel's function loader cannot use the local Node 24 synchronous ESM fallback. `next.config.js` explicitly bundles that parser chain and enables Webpack's loose ESM resolution; no dependency version override is used. Next emits a configuration warning for that compatibility setting. Continuous integration starts the visitor server with `NODE_OPTIONS=--no-experimental-require-module` so this failure cannot hide behind local runtime defaults. Revisit this setting when the sanitizer supports its dependency through a compatible entrypoint or the build moves away from Webpack.
