# Laxiriir Expert Project Handoff

Last reviewed: 2026-07-30

## Purpose

Laxiriir Expert is a video-first consultation platform.

Clients should be able to:

- discover experts
- review profiles and availability
- book and pay for sessions
- attend embedded video consultations
- review consultation history

The product has three roles:

- `Client`
- `Expert`
- `Admin`

## Repository Structure

```text
apps/
  api/       Go and Gin API
  web/       Nuxt 4 web application
  mobile/    Expo and React Native application
packages/
  env/       Shared environment parsing
  platform/  Shared contracts and platform helpers
  config/    Shared TypeScript and Tailwind configuration
infra/
  supertokens/  Local SuperTokens Core setup
```

The repository uses:

- Node.js 20 or newer
- pnpm 9.15.5
- Turborepo
- Go 1.26.1
- Nuxt 4
- Expo 55
- SuperTokens
- Biome

## Current Product Status

The project is an early functional MVP foundation.

It has authentication and a first persistent booking vertical slice.
It is not ready for production.

### Implemented

- public landing and information pages
- expert directory and profile UI
- login, registration, verification, and password recovery UI
- SuperTokens runtime integration
- authenticated `/me` API route
- admin expert approval, rejection, and suspension routes
- persisted expert discovery and availability
- conflict-safe booking creation
- per-client persisted booking history
- client dashboard connected to the booking API
- expert and admin dashboard shells
- basic Expo mobile scaffold
- shared environment, auth, and consultation contracts
- PostgreSQL initial schema migration
- GitHub Actions validation

### In Progress

The current branch stabilizes the dashboard and implements the first booking slice.

It includes:

- client layout
- client sidebar and header
- API-backed dashboard overview
- persisted sessions page
- API-backed experts and availability page
- messages page
- insights page
- client-side auth hydration fixes
- working client logout controls

Messages and insights remain presentation-only placeholders.

### Not Implemented

- expert-managed availability
- booking cancellation and rescheduling
- payment provider and webhook processing
- embedded video session infrastructure
- reminder and notification workers
- ratings and reviews backend
- automated migration execution and version tracking
- staging environment
- continuous deployment
- production monitoring
- complete end-to-end test coverage

## API Status

The Go API currently provides:

- `GET /health`
- `GET /api/v1/ping`
- `GET /api/v1/me`
- `PATCH /api/v1/admin/experts/:id/approve`
- `PATCH /api/v1/admin/experts/:id/reject`
- `PATCH /api/v1/admin/experts/:id/suspend`
- `GET /api/v1/experts`
- `GET /api/v1/experts/:id/availability`
- `GET /api/v1/client/bookings`
- `POST /api/v1/client/bookings`
- SuperTokens routes below `/api/auth`

Payment and video-session API routes are not implemented yet.

## Git Status

Current branch:

```text
codex/stabilize-booking-slice
```

This branch contains the dashboard stabilization, persistent booking slice,
validation workflow, migration files, and project handoff documentation.
Merge it into `main` before treating `main` as the complete movable baseline.

## Commit History

There are nine commits:

| Date | Commit | Summary |
| --- | --- | --- |
| 2026-03-17 | `2bb5f6f` | Initial pnpm workspace and Turborepo setup |
| 2026-03-18 | `96cf446` | Nuxt, Tailwind, and shared UI configuration |
| 2026-03-21 | `ac1908d` | Login, registration, pricing, and expert pages |
| 2026-03-22 | `c39bedb` | UI consistency refactor |
| 2026-03-22 | `13c128a` | About, contact, legal, and error pages |
| 2026-03-23 | `de91c6c` | Color-system improvements |
| 2026-03-23 | `bf4a975` | Planning, auth flows, and local booking UI |
| 2026-03-25 | `07d0e2f` | SuperTokens integration and expert dashboard |
| 2026-04-02 | `dbeaf39` | Client dashboard redesign and design artifacts |

The latest commit is very large.
It mixes application changes with Pencil and temporary HTML design exports.
Future commits should separate application code, documentation, and design files.

## Validation Status

Current validation includes:

- repository-wide Biome lint
- Nuxt type checking with local `vue-tsc`
- mobile and shared-package TypeScript checks
- Go tests and vet
- web API-client tests
- Go API integration tests
- web, mobile, shared-package, and API builds

Raw HTML design exports are excluded from Biome because they are reference
artifacts, not application source.

## Moving the Project

### Recommended Method

Move the project through Git.

1. Review the uncommitted dashboard work.
2. Commit it to a new branch.
3. Push the branch to the remote repository.
4. Clone the repository on the new machine.
5. Copy required secrets separately.

Do not send secrets through Git.

### Files That Must Move Through Git

- `apps/`
- `packages/`
- `infra/`
- `docs/`
- root configuration files
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `turbo.json`
- `README.md`
- `PLANNING.md`
- `PRODUCTION.md`

### Files That Should Not Be Copied

- `node_modules/`
- `.nuxt/`
- `.output/`
- `.turbo/`
- `.expo/`
- build outputs
- log files
- local caches

These can be regenerated after the move.

### Secrets That Must Be Transferred Securely

Local environment files are ignored by Git.
Transfer their values through a password manager or secret manager.

Check:

- `apps/api/.env.local`
- `apps/web/.env.local`
- any mobile local environment file
- SuperTokens credentials
- database credentials
- future payment and video-provider credentials

Use the committed `.env.example` files as templates.

## Setup After Moving

Install the required runtimes:

- Node.js 20 or newer
- pnpm 9.15.5
- Go 1.26.1
- Docker for local SuperTokens

Then run:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Start each application through Turborepo:

```bash
pnpm turbo run dev --filter=web
pnpm turbo run dev --filter=api
```

```bash
pnpm turbo run dev --filter=mobile
```

## Recommended Next Work

1. Add expert-managed availability.
2. Add cancellation and rescheduling rules.
3. Integrate payments and verified webhooks.
4. Add authorized video-session access.
5. Configure staging and production infrastructure.

## Release Assessment

Do not describe the project as production-ready yet.

The first database-backed booking slice is complete. The next meaningful
milestone is a transaction-ready consultation lifecycle with:

- expert-managed availability
- cancellation and rescheduling rules
- payment authorization and verified webhooks
- authorized video-session access
- basic browser-level end-to-end coverage
