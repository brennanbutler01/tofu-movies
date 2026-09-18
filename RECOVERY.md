# Tofu.Movies recovery status

Updated September 18, 2026. [Try the demo](https://tofu-movies-demo.vercel.app). The recovered application now has a database-backed, isolated visitor mode. See [VISITOR-DEMO.md](VISITOR-DEMO.md).

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

The public visitor mode uses fictional films and private PostgreSQL records with one-hour sessions, same-origin mutations, persisted budgets, capacity limits and cascading reset. It runs on the personal Vercel project with a dedicated Neon free database. Hosted desktop/mobile workflows and API isolation checks pass after fixing a sanitizer module-loading incompatibility. The verified runtime commit is `8ccbeca`, deployed as `dpl_9zstq9S9ga2W3x7PWbsrnR4Zdm8o`.

The ordinary application's Google sign-in, live catalogue and Cloudinary upload journeys remain unverified with new credentials. They are disabled in visitor mode; normal-mode provider quotas and abuse limits need separate operational review. The previous static export remains under `portfolio-site/` for reference.

See [DEPENDENCIES.md](DEPENDENCIES.md) for three remaining advisories in Prisma development tooling. These have not been marked fixed. Removed upload/editor dependencies and refreshed direct dependencies eliminate the prior application dependency backlog.

## Source and credential hygiene

The public edition starts from the reviewed source, excluding old Git history, screenshots and uploaded images. The affected original repository remains private. Source scans and history cleanup do not revoke old credentials; provider revocation and GitHub cached-commit removal remain separate follow-up. Never reuse historical credentials.
