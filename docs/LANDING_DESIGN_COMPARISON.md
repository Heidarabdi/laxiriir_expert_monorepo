# Landing design comparison

Updated: 2026-09-02. The user approved a design-taste-frontend comparison after the Pen-matching pass. This is a design proposal, not final visual acceptance.

## Compare locally

- Revised landing: http://localhost:3000/?design=revised
- Preserved Pen implementation: http://localhost:3000/?design=pen
- The comparison bar appears only in development when a design parameter is present.
- The normal homepage uses the revised version. Production ignores the Pen preview, and the old component is excluded from its bundle.
- The original `untitled.pen` is unchanged.

## What changed

- Full-width illustrated hero with two cartoon figures framing centered copy and one primary browsing action. This replaces the first split-photo proposal at the user's request.
- A single emerald accent and consistent light/dark surfaces, scoped to the landing page.
- No invented customer logos, ratings, review counts, or service-status indicator on the revised landing.
- Replaced future video, escrow, and AI claims with existing profile, availability, booking, and messaging workflows.
- Searchable expert rows use the API's profiles, categories, biography, and listed rate; no fallback seed profiles are added by this page.
- Loading, empty, failed-request/retry, and no-search-match states use existing shadcn components.
- Existing authentication-aware avatar menu and theme control remain. No dashboard or auth styling changes.

## Scope still open

- User approval of the revised appearance.
- Full public-site marketing/legal review: other public pages still retain earlier copy.
- Payment, video, reminder-worker, and monitoring integrations remain deferred.
- Live expert data can still include development seeds supplied by the API. This redesign does not change database seeding.
- This page is not evidence that the whole project is production-ready.

## Checks performed

- Web TypeScript check and production build pass; all 7 web unit tests pass.
- Biome checks pass for the changed landing, shell, search, and stylesheet files.
- Inspected the illustrated desktop hero in light and dark themes and the mobile layout at 390px; no horizontal overflow.
- Opened the original Pen implementation through the comparison link. Its unique copy and comparison controls are absent from production JavaScript.
- Observed the directory's retry state when API requests failed in the local test browser. Live booking/sign-in flows were not retested in this design pass.
- Lighthouse produced a report for the earlier photo proposal on the development server, then exited with a Windows temporary-directory cleanup error. It is not a release-performance result for the final illustration; production performance auditing remains open.

## Image provenance

- Workspace asset: `apps/web/public/images/consultation-illustration.png`
- Generated with the built-in image-generation tool for this design comparison.
- Generic cartoon illustration with genuine transparency, not real listed experts or testimonials. The same asset works over the light and dark theme backgrounds.
- Original generated file retained outside the repository.

Final generation prompt:

> Use case: illustration-story. Asset type: wide decorative hero illustration for a professional expert-consultation website. Create one premium editorial cartoon illustration, landscape 16:9, genuinely transparent PNG background, no checkerboard. Composition: a very wide scene framing a large EMPTY central and upper area reserved for website headline and buttons. On the far left, an expressive stylized adult woman in an evergreen blouse seated at a simple desk, holding a pencil over an open notebook. On the far right, an expressive adult man with warm brown skin and round glasses seated comfortably with an open laptop on his knees, listening thoughtfully. Figures should be large and full-bodied, concentrated in the outer left and outer right 25 percent of the image, anchored to the bottom edge, leaving the central 50 percent and upper center entirely empty. A few simple desk objects and a small plant at the bottom edges give the scene character. Art direction: sophisticated hand-drawn editorial cartoon, confident slightly imperfect dark green outlines, simplified organic silhouettes, subtle paper-grain texture inside the colored shapes, flat muted evergreen and sage clothing, cream details, warm natural skin tones. Friendly, intelligent, contemporary, adult rather than childish. Not photorealistic, not 3D, not glossy clipart, not corporate stock vector. Figures face inward toward the central area to suggest a thoughtful remote conversation. Constraints: no typography, no letters, no numbers, no logos, no watermark, no fake interface cards, no speech bubbles, no floating icons, no badges, no border, no floor or opaque background behind the figures. Keep the center transparent and visually quiet. The asset must work over both an off-white background and a deep forest-green background.
