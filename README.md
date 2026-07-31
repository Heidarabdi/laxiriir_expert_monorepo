# Laxiriir Expert

Video-first virtual consultation platform for booking and holding secure sessions with professionals such as doctors, tutors, sheikhs, advisors, and other experts without leaving the platform.

## Product Vision

Laxiriir Expert is designed as an end-to-end consultation platform where clients can discover experts, review their availability, book time slots, pay for sessions, and join embedded video consultations from the same product. The platform also supports scheduling workflows, reminders, consultation history, and future AI-assisted experiences.

## User Roles

- `Admin`: platform oversight, user management, payments, analytics
- `Expert`: professionals offering consultations
- `Client`: users booking and attending consultations

## Core Features

### Booking and Scheduling

- Browse experts by category and expertise
- View expert availability in calendar form
- Select time slots and book appointments
- Reschedule or cancel appointments

### Video Consultations

- Generate secure meeting links automatically
- Join embedded video sessions inside the platform
- Avoid dependency on third-party meeting apps

### Payments and Reminders

- Secure booking payments, including deposits or full payment
- Subscription or package plans
- Automated reminders through email, SMS, or in-app notifications

### Tracking and History

- Appointment history and consultation records
- Ratings and reviews
- Post-session summaries

## Optional AI Features

- AI recommendations for matching clients with the right expert
- Session summarization after meetings
- AI chat assistant for FAQs and session preparation
- Predictive scheduling to reduce no-shows and empty calendar gaps

## Repository Structure

- `apps/api`: Go API using Gin
- `apps/web`: Nuxt 4 frontend with Tailwind CSS v4
- `apps/mobile`: Expo / React Native client
- `packages/env`: shared environment parsing and defaults
- `packages/platform`: shared API contracts and URL helpers
- `packages/config/*`: shared repository configuration packages
- `infra/supertokens`: local SuperTokens Core scaffolding for development and CI

## Monorepo Tooling

- Package manager: `pnpm`
- Task runner: `turbo`
- Formatter and linter: `biome`
- Minimum Node.js: `20`

Detailed production planning lives in `PRODUCTION.md`.

Current project status and move instructions live in
[`docs/PROJECT_HANDOFF.md`](./docs/PROJECT_HANDOFF.md).

## Local Development

Install dependencies from the repository root:

```bash
pnpm install
```

Run all apps:

```bash
pnpm dev
```

Run checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm check
```

Run a single app:

```bash
pnpm turbo run dev --filter=web
pnpm turbo run dev --filter=mobile
pnpm turbo run dev --filter=api
```

## Environment

The API defaults to port `8080`.

Create local env files from the examples:

```bash
apps/api/.env.example
apps/web/.env.example
apps/mobile/.env.example
```

Current variables:

- `PORT`
- `GO_ENV`
- `DATABASE_URL`
- `NUXT_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_API_BASE_URL`

## Production Plan

Recommended production topology for the current stack:

- `apps/api`: deploy as a Go service on a container or VM platform behind HTTPS
- `apps/web`: deploy Nuxt as a separate frontend application and point it at the API through `NUXT_PUBLIC_API_BASE_URL`
- `apps/mobile`: use Expo EAS for development builds, preview builds, and store-ready production builds
- Video: start with a managed provider such as LiveKit Cloud instead of self-hosting WebRTC on day one
- Database: PostgreSQL
- Async jobs: queue and worker process for reminders, webhook retries, summaries, and notifications
- Notifications: email plus SMS provider
- Payments: provider with support for deposits, full payments, subscriptions, and webhooks

Suggested production services by responsibility:

- API hosting: Fly.io, Railway, Render, or another container-capable host
- Web hosting: Nuxt-capable Node host
- Database: managed PostgreSQL
- Object storage: S3-compatible storage
- Video: LiveKit Cloud
- Email: Resend, Postmark, or equivalent
- SMS: Twilio or equivalent
- Monitoring: error tracking plus structured logs

## Mobile Release Path

The mobile app is now configured to prefer development builds over Expo Go.

- `pnpm turbo run dev --filter=mobile` starts Expo with `--dev-client`
- `apps/mobile/eas.json` defines `development`, `preview`, and `production` profiles
- `apps/mobile/app.json` includes a stable app name, slug, scheme, iOS bundle identifier, Android package name, and the `expo-dev-client` plugin

## Monorepo Production Notes

Turborepo task hashing is environment-aware per app:

- web tasks hash `NUXT_PUBLIC_API_BASE_URL`
- mobile tasks hash `EXPO_PUBLIC_API_BASE_URL`
- api tasks hash `PORT`, `GO_ENV`, and `DATABASE_URL`

Each app also includes its own `.env*` files in task inputs so cache results stay aligned with environment changes.

## Current Baseline

What already exists:

- SuperTokens email-password, verification, recovery, and session integration
- role-aware client, expert, and admin route protection
- persisted expert discovery and availability APIs
- conflict-safe client booking creation and booking history APIs
- client dashboard, expert directory, availability selection, and session list
- SQLite support for tests and local development
- PostgreSQL schema migration for deployed environments
- GitHub Actions validation for lint, type checks, tests, and builds
- mobile status screen wired to shared env and platform helpers
- API integration tests and web API-client tests

What still needs product work:

- payments
- embedded video sessions
- reminders and notifications
- expert-managed availability
- booking cancellation and rescheduling
- operational admin and expert dashboards
- ratings, reviews, and consultation history
- AI-assisted workflows

## Before Moving or Merging

Use [`docs/PROJECT_HANDOFF.md`](./docs/PROJECT_HANDOFF.md) before moving the
repository. Local environment files and secrets are not stored in Git.

Production readiness still depends on these decisions:

- confirm the canonical Go module path
- choose the managed PostgreSQL host
- choose payment provider
- choose reminder providers
- choose managed video provider and meeting token flow
- choose hosting providers for web and API

## Next Build Targets

1. Add expert-managed availability creation and editing.
2. Add booking cancellation and rescheduling rules.
3. Integrate the payment provider and webhook reconciliation.
4. Add the managed video provider and authorized session-room access.
