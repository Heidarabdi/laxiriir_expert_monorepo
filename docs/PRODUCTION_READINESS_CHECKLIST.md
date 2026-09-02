# Production Readiness Checklist

Last updated: 2026-09-02

This is the execution checklist for taking Laxiriir Expert from the completed
Go-to-TypeScript migration to a production-ready product. Update a checkbox
only after the implementation and its relevant tests pass.

## Current position

- [x] Go API replaced by the Fastify TypeScript API.
- [x] Nuxt replaced by TanStack Start.
- [x] SuperTokens replaced by Better Auth.
- [x] PostgreSQL/Neon, Drizzle migrations, shared contracts, and typed API client are in place.
- [x] Core client booking, expert operations, admin moderation, and role dashboards exist.
- [x] Saved experts and persistent in-app booking notifications are implemented.
- [x] Booking-scoped messaging, shared account settings, and the support queue are implemented.
- [ ] The product is not production-ready until the release gate at the end of this document is complete.

## 1. Finish the existing product experience

### Client

- [x] Persist saved experts in PostgreSQL.
- [x] Add authenticated saved-expert API routes and typed client methods.
- [x] Replace the saved-experts placeholder with a real shadcn page.
- [x] Add save/remove controls to the expert directory and profile.
- [x] Persist booking notifications and read/unread state.
- [x] Replace the notifications placeholder with a real shadcn page.
- [x] Finish the client profile with real save behavior.
- [x] Add persisted client timezone and notification settings.
- [x] Verify booking details, cancellation, and rescheduling through integration tests.
- [x] Add private booking-scoped client/expert messaging with read state.

### Expert

- [x] Dashboard, availability management, sessions, earnings, and profile editing are implemented.
- [x] Finish persisted account/settings behavior.
- [x] Connect booking notifications to the expert workspace.
- [ ] Verify every create/edit/delete action uses an accessible shadcn dialog or alert dialog where appropriate.
- [x] Add the expert side of private booking-scoped messaging.

### Admin

- [x] Dashboard, expert moderation, bookings, users, finance-value views, and analytics are implemented.
- [ ] Configure and verify the first bootstrap admin account.
- [x] Finish persisted account/settings behavior.
- [x] Add administrator notifications and an in-app support queue with assignment and resolution.

### Public and authentication

- [x] Finish the public landing, pricing, about, contact, privacy-summary, terms-summary, and FAQ content pass.
- [x] Restore the Pen landing-page feature grid proportions, colored accents, section widths, category pills, pricing treatment, and CTA gradient using the existing shadcn components.
- [x] Implement the shared public-header account dropdown and theme selector for signed-in and signed-out visitors.
- [ ] Complete landing-page visual acceptance against `untitled.pen`; preserve the source design unless a change is explicitly approved or required for working/accessibility behavior.
- [ ] Validate marketing claims before launch: customer names, expert ratings/review counts, identity-vetting claims, video performance/encryption, escrow/payouts, and AI summaries. Current design copy is not evidence that these integrations are shipped.
- [x] Implement the user-approved design-taste-frontend comparison: full-width cartoon hero, simpler hierarchy, real expert search, and fewer unsupported marketing claims. Preserve the original Pen implementation in a development-only preview; see `LANDING_DESIGN_COMPARISON.md`.
- [ ] Obtain user acceptance of the revised illustrated landing before treating it as the final approved design.
- [ ] Replace the privacy and terms summaries with jurisdiction-reviewed legal documents before launch.
- [ ] Finish the public expert directory and expert-profile visual pass.
- [ ] Verify login, registration, recovery, reset, and verification in development and production modes.
- [x] Add deterministic titles/descriptions and production-safe not-found content.
- [ ] Add canonical URLs and a social-preview image after the production domain and asset are chosen.

## 2. Production infrastructure

These items need external provider decisions or credentials and should be built
after the current database-backed workflows are complete.

### Payments

- [ ] Choose and configure the payment provider.
- [ ] Create payment intents on the server.
- [ ] Verify webhook signatures and make reconciliation idempotent.
- [ ] Connect booking payment states to client, expert, and admin views.
- [ ] Implement refunds, payouts, and an auditable finance history.

### Video sessions

- [ ] Choose and configure the video provider.
- [ ] Create rooms only for valid confirmed bookings.
- [ ] Issue short-lived, role-authorized room tokens.
- [ ] Build the in-app consultation room and failure/reconnect states.

### Notifications and jobs

- [x] Persist in-app notifications and read/unread state.
- [ ] Add scheduled reminder jobs for upcoming sessions.
- [ ] Add email delivery retries and failure tracking.
- [x] Add persisted in-app/email notification preferences.
- [ ] Connect preferences to production email delivery controls.

### Operations

- [ ] Configure structured production logging and secret-safe error reporting.
- [ ] Add health, database, auth, payment-webhook, and deployment smoke checks.
- [ ] Configure backups and test database restore procedures.
- [ ] Document deployment, rollback, migrations, and incident response.

## 3. UI quality gate

- [x] Use generated shadcn components and supported composition patterns, including the official message, bubble, and message-scroller primitives.
- [ ] Match the approved `untitled.pen` structure where it improves the product, while correcting weak interaction or responsive decisions.
- [ ] Verify loading, empty, error, success, disabled, hover, focus, and destructive states.
- [ ] Verify sidebar, dialogs, forms, tables, charts, and navigation on mobile, tablet, and desktop.
- [ ] Complete keyboard navigation, accessible names, focus management, color contrast, and reduced-motion checks.
- [ ] Verify Chromium and Firefox without hydration or module-loading console errors.

## 4. Engineering and release gate

- [x] Every new API route uses shared Zod contracts, authorization, response schemas, and integration tests.
- [x] Every database change has a generated Drizzle migration and is exercised from a clean migrated test database.
- [x] Contracts, API client, API, web, mobile, lint, typecheck, tests, and production builds pass for this checkpoint.
- [ ] Production environment variables are documented and configured outside Git.
- [ ] Neon connection, migrations, bootstrap admin, email, payment, and video credentials are verified in the production environment.
- [ ] A clean production smoke test completes registration/login, expert discovery, booking, payment, session access, and admin inspection.

## Recommended execution order

1. [x] Finish saved experts and persistent in-app notifications.
2. [x] Finish profile/settings, messaging, support, and remaining real CRUD interactions for all roles.
3. [ ] Finish public pages and the complete shadcn responsive/accessibility pass.
4. [ ] Integrate payments, including webhooks and reconciliation.
5. [ ] Integrate authorized video rooms.
6. [ ] Add reminder workers, email retries, and notification preferences.
7. [ ] Add monitoring, deployment/rollback documentation, and run the release gate.

## Definition of done

A page is not complete merely because it renders. It is complete when it uses
real authorized data, provides its intended actions, handles loading/empty/error
states, uses accessible generated shadcn components, works responsively, and has
the appropriate automated coverage. The project is production-ready only when
all release-gate items above are checked.

## Latest verification snapshot

Verified on 2026-09-01 after messaging, shared settings, support operations,
metadata, and accessibility corrections:

- [x] `pnpm lint` — all 7 workspaces passed.
- [x] `pnpm typecheck` — all 11 dependency-aware tasks passed.
- [x] `pnpm test` — all 11 tasks passed, including all 44 Fastify API tests.
- [x] `pnpm --filter web build` — client and SSR production bundles passed.

## Deliberately deferred final large phase

The remaining large product integrations are intentionally last:

1. [ ] Payments, webhooks, refunds, and expert payouts.
2. [ ] Authorized video rooms and short-lived participant tokens.
3. [ ] Reminder workers, email retries, and delivery tracking.
4. [ ] Production monitoring, backup/restore, deployment, and incident operations.

The remaining smaller launch checks require deployment choices rather than more
local feature scaffolding: production domain/canonical metadata, reviewed legal
documents, Neon migration verification, bootstrap-admin verification, production
email/auth verification, and the manual responsive/accessibility/browser pass.
