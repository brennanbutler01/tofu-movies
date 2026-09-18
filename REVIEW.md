# Reviewer guide

## Start here

1. Open [the demo](https://tofu-movies-demo.vercel.app). Search for “orbit,” save it, then open My watchlist.
2. Open a film, mark it watched and write a review. Reload to see per-tab persistence, then use Reset demo.
3. Inspect `portfolio/library.ts` for filtering and browser-state validation, and `portfolio/Demo.tsx` for the UI.
4. Inspect `server/movieLists.ts` and `pages/api/movieLists/[id].ts` for the original application's access rules. The old GET-to-DELETE fallthrough is removed; owner-only deletion and shared editing are separate decisions.
5. Inspect `server/writeSchemas.ts`, `utils/reviewHtml.ts` and the review reaction endpoint for validation and content handling.
6. Run the commands in the README. `scripts/verify-local-api.mjs` verifies the actual handlers against a disposable database.

## Verified September 18, 2026

-   TypeScript check and original Next.js production build.
-   12 unit tests covering list permissions, input validation, filtering and browser state.
-   60 real HTTP/database checks covering read preservation, owner/member/outsider access, follow/unfollow, nested-write rejection, profile and review isolation, and server-rendered access.
-   Five Playwright scenarios, passed locally and against the public deployment, covering search/filtering, watchlists, reviews/reload/reset, independent visitors, mobile layout, and missing backend/credential paths.
-   Desktop and mobile screenshots inspected.

The hosted experience is a static portfolio demo. It intentionally has no shared accounts, live catalogue, cloud uploads, database or external-service calls. This is not a claim that every legacy backend route is production-ready. See `RECOVERY.md` for the remaining work.
