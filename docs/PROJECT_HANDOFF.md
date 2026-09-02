# Project Handoff

Last reviewed: 2026-08-31

## Current status

The backend overhaul is complete. The repository now has one API implementation
in `apps/api-ts`; the Go API and SuperTokens infrastructure were removed.
Existing domain rows are preserved by the migration. SuperTokens sessions and
password credentials are not portable, so pre-migration users must register or
reset their credentials in Better Auth.

Current stack:

- TanStack Start React web application
- TanStack Router, Query, and Form
- shadcn/ui generated components on Tailwind CSS v4
- Expo mobile application
- Fastify 5 TypeScript API
- Better Auth for email/password, verification, recovery, and cookie sessions
- Drizzle ORM with PostgreSQL
- pnpm and Turborepo

Implemented backend contracts include health/ping, current user, expert listing,
availability, client booking creation/history, expert-owned booking history and
dashboard summaries, expert profile editing, admin expert moderation, and
admin-wide user and booking inspection.

## Moving the repository

Local secrets are intentionally not committed. Before moving machines, copy
these files securely if they exist:

- `apps/api-ts/.env.local`
- `apps/web/.env.local`
- `apps/mobile/.env.local`

Then run:

```bash
pnpm install
pnpm --filter api-ts db:migrate
pnpm check
```

Start the API and web app with:

```bash
pnpm --filter api-ts dev
pnpm --filter web dev
```

The API defaults to `http://localhost:8081`. It requires PostgreSQL when
running normally; automated API tests use embedded PostgreSQL and do not need
Docker.

## Required API environment

- `DATABASE_URL`
- `BETTER_AUTH_SECRET` (at least 32 random characters)
- `BETTER_AUTH_URL`
- `TRUSTED_ORIGINS`
- `AUTH_BOOTSTRAP_ADMIN_EMAILS`
- `RESEND_API_KEY`
- `EMAIL_FROM`

Production also requires HTTPS URLs and real email delivery credentials.

## Project progress checklist

This is the working checklist for moving the product forward. Change `[ ]` to
`[x]` only after the feature is implemented and its relevant checks pass.

The detailed post-migration execution order and production release gate live in
[PRODUCTION_READINESS_CHECKLIST.md](./PRODUCTION_READINESS_CHECKLIST.md).

### Migration and foundation

- [x] Replace the Go API with the Fastify TypeScript API.
- [x] Replace SuperTokens with Better Auth.
- [x] Remove the legacy Go application and its Docker-only auth setup.
- [x] Move the application database to PostgreSQL/Neon through Drizzle.
- [x] Preserve legacy user IDs and booking ownership during migration.
- [x] Add API integration tests, shared API-client tests, and CI validation.
- [x] Require Node.js 22.18 or newer in the repository and CI.

### Monorepo packages

- [x] Make `packages/contracts` the shared Zod contract source for API, web, and mobile.
- [x] Move typed HTTP behavior from `packages/platform` to `packages/api-client`.
- [x] Make shared packages consume `@repo/typescript-config` through package exports.
- [x] Add real contract, API-client, and environment package tests.
- [x] Remove the unused Tailwind config package and its placeholder tasks.
- [x] Add package-boundary validation to CI for all workspaces.
- [x] Replace Nuxt with TanStack Start and remove the legacy web source.

### Server/API

- [x] Email/password registration, login, logout, recovery, and sessions.
- [x] Client, expert, and admin role authorization.
- [x] Development-only bypass for email verification and expert approval.
- [x] Expert discovery and availability endpoints.
- [x] Expert-managed availability creation, editing, and deletion.
- [x] Client booking creation and booking history.
- [x] Client booking cancellation and same-expert rescheduling.
- [x] Admin actions to approve, reject, and suspend an expert.
- [x] Add an admin endpoint to list pending, approved, rejected, and suspended experts.
- [ ] Configure and verify the first bootstrap admin account.
- [x] Add expert-owned upcoming and past booking endpoints.
- [x] Add expert dashboard summary endpoints.
- [x] Add admin-wide booking and user inspection endpoints.
- [x] Add an idempotent development workspace seed with loginable client, expert, review-state, and admin accounts.
- [x] Add expert profile editing.
- [x] Add persisted saved experts and in-app booking notifications.
- [ ] Add payment intents and verified webhook reconciliation.
- [ ] Add authorized video-room creation and access tokens.
- [ ] Add reminder and notification workers.
- [ ] Add production monitoring, error reporting, and deployment smoke checks.

### Web application

- [x] Registration, login, logout, verification, and password recovery pages.
- [x] Role-aware client, expert, and admin route protection.
- [x] Client dashboard and real expert directory.
- [x] Availability selection and booking creation.
- [x] Client session history, cancellation, and rescheduling.
- [x] Expert availability calendar with create, edit, and delete controls.
- [x] Use shadcn dialogs for expert availability creation and editing.
- [x] Build the admin expert-review table with approve, reject, and suspend actions.
- [x] Build the expert workspace navigation and dashboard.
- [x] Show an expert's upcoming and past bookings.
- [x] Build expert profile editing.
- [x] Build real admin booking and user directories with search, filters, and booking inspection.
- [x] Build real client, expert, and admin analytics from persisted records.
- [x] Upgrade all three role dashboards with live charts and operational content.
- [x] Replace the public `/experts` and `/experts/:id` demo data with API data.
- [x] Add real saved-expert and in-app notification pages with booking event data.
- [x] Add client profile editing and an expert booking-notification workspace.
- [ ] Add payment checkout and payment-result states.
- [ ] Add the in-app video consultation room.
- [ ] Add notification and reminder surfaces.
- [ ] Complete responsive, loading, empty, error, and accessibility states.

### UI implementation from `untitled.pen`

- [ ] Finish auditing and applying the design tokens and screen structure to shadcn/ui.
- [x] Rebuild login and registration to match the approved design.
- [x] Finish the shadcn dashboard/sidebar composition and visual-density pass.
- [x] Finish the client dashboard, expert discovery, booking, and session-management UI.
- [x] Replace client Insights with real booking analytics and add persistent favorites, notifications, and booking-scoped messaging.
- [x] Finish the expert dashboard, availability, sessions, earnings, profile, messages, notifications, settings, and support workflows.
- [x] Finish admin overview, moderation, bookings, users, finance-value, analytics, notifications, settings, and support operations.
- [x] Finish the public marketing, directory, profile, help, and account-recovery content pass.
- [ ] Run the final responsive, visual, accessibility, and browser verification pass.

### Later product work

- [ ] Ratings and reviews.
- [ ] Consultation notes and history.
- [ ] Payment settlement, refunds, payouts, and audit operations (admin booking, user, and analytics inspection are complete).
- [ ] Complete the mobile client after the web workflows are stable.
- [ ] Add optional AI-assisted matching and session summaries.

## Immediate next milestone

The API and framework migrations are complete. UI implementation is now the
active milestone; large product infrastructure stays paused until the existing
experience is visually complete:

- [x] UI: finish authentication.
- [x] UI: finish the client dashboard, discovery, booking, session, insights, billing-value, saved-expert, notification, message, settings, and support surfaces.
- [x] UI: finish the expert dashboard, availability, sessions, earnings, profile, messages, notifications, settings, and support surfaces.
- [x] UI: finish the admin dashboard, moderation, booking, finance-value, user, analytics, notification, settings, and support surfaces.
- [x] UI: finish the public-page content and metadata pass.
- [ ] UI: run the final manual responsive, visual, accessibility, and Firefox/Chromium verification pass.
- [ ] Setup: configure and verify a bootstrap admin account.
- [x] Server and web: add expert profile editing.
- [x] Server and web: add persistent in-app notifications and preferences.
- [ ] Server and web: add payments, video rooms, reminder workers, and monitoring as the final large phase.

For the exact live checkboxes, verification snapshot, deployment-only checks,
and deliberately deferred large integrations, use
[`PRODUCTION_READINESS_CHECKLIST.md`](./PRODUCTION_READINESS_CHECKLIST.md).
