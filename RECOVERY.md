# Tofu.Movies recovery status

Updated September 18, 2026. [Try the static demo](https://tofu-movies-demo.vercel.app). The original authenticated application runs locally with a disposable PostgreSQL database.

## Implemented and verified

- Node 24, Next.js 16.3.4, React 18.3.1 and Prisma 7.10.0 with the PostgreSQL adapter. Both the original application and static demo build.
- Explicit SuperJSON serialization for server-rendered props and compatible color-scheme cookies.
- Movie-list reads no longer delete lists. Owner/member/public access, opt-in shared editing, owner-only metadata changes and deletion are enforced.
- Strict schemas constrain list, review, watchlist and provider writes. Ownership comes from the session. Provider batch updates verify all affected records before committing.
- Review authors control their content. Reactions have a separate per-user endpoint. Public review responses omit email addresses, and review HTML is sanitized when saved and rendered.
- Shared catalogue entries cannot be overwritten through arbitrary update bodies. Private lists are excluded from catalogue relations.
- Authenticated image uploads are bounded to one 5 MB image and request raster-format validation and WebP output from Cloudinary. Temporary files are removed. The unsigned upload widget was removed.
- Movie-provider endpoints require authentication and configured credentials. Provider HTTP calls have timeouts, response-size limits, no redirects and sanitized errors. Random-film discovery is bounded to three attempts.
- Twelve unit tests, 60 real HTTP/database checks and five static-demo browser scenarios pass. Local fixtures are deleted after tests.

## Deployment boundaries

The hosted demo contains fictional films and per-tab watchlists/reviews. Only a static export is uploaded; it has no backend, database, provider keys or live catalogue. The authenticated application's external sign-in, catalogue and Cloudinary upload journeys still require testing with newly provisioned development credentials before hosting. Provider quotas, abuse limits and concurrent-write behavior need deployment-specific review.

See [DEPENDENCIES.md](DEPENDENCIES.md) for three remaining advisories in Prisma development tooling. These have not been marked fixed. Removed upload/editor dependencies and refreshed direct dependencies eliminate the prior application dependency backlog.

## Source and credential hygiene

The public edition starts from the reviewed source, excluding old Git history, screenshots and uploaded images. The affected original repository remains private. Source scans and history cleanup do not revoke old credentials; provider revocation and GitHub cached-commit removal remain separate follow-up. Never reuse historical credentials.
