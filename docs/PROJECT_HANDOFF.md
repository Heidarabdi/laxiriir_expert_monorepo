# Project Handoff

Last reviewed: 2026-08-28

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
availability, client booking creation/history, and admin expert moderation.

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
- [ ] Add expert-owned upcoming and past booking endpoints.
- [ ] Add expert dashboard summary endpoints.
- [ ] Add expert profile editing.
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
- [x] Build the admin expert-review table with approve, reject, and suspend actions.
- [x] Build the expert workspace navigation and dashboard.
- [ ] Show an expert's upcoming and past bookings.
- [ ] Build expert profile editing.
- [x] Replace the public `/experts` and `/experts/:id` demo data with API data.
- [ ] Add payment checkout and payment-result states.
- [ ] Add the in-app video consultation room.
- [ ] Add notification and reminder surfaces.
- [ ] Complete responsive, loading, empty, error, and accessibility states.

### Later product work

- [ ] Ratings and reviews.
- [ ] Consultation notes and history.
- [ ] Admin booking, payment, user, and analytics operations.
- [ ] Complete the mobile client after the web workflows are stable.
- [ ] Add optional AI-assisted matching and session summaries.

## Immediate next milestone

The API and web migrations are complete. The next milestone is the remaining
consultation product infrastructure:

- [ ] Setup: configure and verify a bootstrap admin account.
- [ ] Server and web: add payment intents and verified webhook reconciliation.
- [ ] Server and web: add authorized video rooms and access tokens.
- [ ] Server: add expert-owned booking and dashboard-summary endpoints.
- [ ] Operations: add reminders, monitoring, and deployment smoke checks.
