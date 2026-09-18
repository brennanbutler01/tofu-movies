# Reviewer guide

1. Open [the demo](https://tofu-movies-demo.vercel.app) and choose **Start demo**. No signup is required.
2. Browse the fictional sample films, add one to your watchlist, mark it watched and write a review. Edit your review and reload to check database persistence.
3. Create and edit a list, then reset the demo. A new visitor session starts without the prior records.
4. Inspect `server/visitor.ts`, `server/deleteOwnedUser.ts` and the schema for cookie lifetime, database budgets, capacity checks and cascading cleanup.
5. Inspect `server/movieLists.ts`, the list/review routes and `server/writeSchemas.ts` for access rules and validated writes. Visitor mode restricts reads to the current visitor even when a list is marked public.
6. Inspect `utils/reviewHtml.ts` and `next.config.js` for content sanitization and hosted module compatibility.
7. Follow [VISITOR-DEMO.md](VISITOR-DEMO.md) to run the application and tests. `portfolio-site/` is the previous static edition, retained separately.

## Verification

- TypeScript and production builds.
- Twelve unit tests and 60 normal-mode HTTP/database regression assertions.
- Separate visitor cookie jars test private lists/reviews, denied shared writes, cross-origin rejection and rendered-page isolation.
- Database checks exercise physical cleanup, concurrent reset/write behavior, expiry and persisted request limits.
- Desktop/mobile production browser workflows cover lists, watch history, editable reviews, reactions, reload, reset and failed-save recovery. Screenshots are inspected at both widths.
- Hosted desktop/mobile workflows and separate-visitor API isolation checks passed on September 18, 2026, after correcting a Vercel sanitizer-loader incompatibility. The strict-loader regression check is included in continuous integration.

Only synthetic records and a dedicated demo database are used. Google sign-in, live catalogue lookup and uploads are disabled. This does not claim that external integrations have been credential-tested or that all historical credentials have been revoked.
