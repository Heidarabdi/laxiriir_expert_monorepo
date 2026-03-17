# Production Plan

This document captures the intended production setup for Laxiriir Expert. It is a planning document, not a final infrastructure contract. Update it whenever a major production decision is confirmed.

## Goal

Ship a video-first consultation platform with:

- reliable booking and scheduling
- secure payments
- embedded video sessions
- reminders and notifications
- auditability for appointments and payments
- room to add AI workflows later without reworking the core architecture

## Recommended Production Stack

## Hosting Decision

Default recommendation for the first production deployment:

- API hosting: Render
- Web hosting: Render
- Database: Render PostgreSQL
- Mobile builds and releases: Expo EAS
- Video: LiveKit Cloud

Why this is the default:

- one platform can host the Go API, Nuxt web app, and PostgreSQL with simple private networking
- lower operations overhead than splitting hosting across multiple vendors on day one
- easier staging and production rollout for a small team
- easy to revisit later if scale, compliance, or cost changes

### Applications

- `apps/api`: Go API, deployed as the primary backend service
- `apps/web`: Nuxt frontend, deployed separately and configured to call the API
- `apps/mobile`: Expo app, distributed through EAS and app stores

### Core Services

- API hosting: Render
- Web hosting: Render
- Database: Render PostgreSQL
- Object storage: S3-compatible bucket storage
- Video: LiveKit Cloud
- Payments: Stripe or equivalent provider with subscriptions and webhook support
- Email: Resend, Postmark, or equivalent transactional provider
- SMS: Twilio or equivalent provider
- Monitoring: error tracking plus centralized logs
- Background jobs: queue and worker process for reminders, summaries, webhooks, and retries

## Hosting Alternatives Reviewed

### Render

Best current fit for the default stack.

- good fit for hosting the Go API, Nuxt web app, background jobs, and PostgreSQL together
- simpler initial operations model for staging and production
- better default choice when speed and operational simplicity matter more than low-level infra control

### Fly.io

Good option, especially for the Go API, but not my first recommendation for the initial all-in-one production stack.

- strong for containerized Go services
- attractive if you want more infrastructure control earlier
- not as simple as Render for starting with API, web, and managed database under one default setup

### Railway

Still a valid alternative, but I would keep it as the backup option.

- easy to get started with
- good developer experience
- less compelling than Render as the default long-term home for this stack

## Architecture Shape

### Backend

The Go API should own:

- authentication and authorization
- user, expert, and admin roles
- availability and booking rules
- payment intent and webhook handling
- meeting creation and token generation
- reminders and notification orchestration
- consultation history and audit trails
- AI feature orchestration when added later

### Frontend

The Nuxt app should own:

- marketing and landing pages
- client dashboard
- expert dashboard
- admin dashboard
- booking and payment flows
- embedded web video experience

### Mobile

The Expo app should initially focus on:

- authentication
- browsing experts
- booking sessions
- reminders
- joining consultations
- appointment history

## Environment Strategy

### API

Expected environment variables:

- `PORT`
- `GO_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `PAYMENT_SECRET_KEY`
- `PAYMENT_WEBHOOK_SECRET`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `LIVEKIT_URL`
- `EMAIL_API_KEY`
- `SMS_API_KEY`

### Web

Expected environment variables:

- `NUXT_PUBLIC_API_BASE_URL`
- `NUXT_PUBLIC_LIVEKIT_URL` if the client connects directly to video infrastructure

### Mobile

Expected environment variables:

- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_LIVEKIT_URL` if the mobile app connects directly to video infrastructure

## Environment Stages

Use at least three environments:

- `development`: local API and local frontend/mobile development
- `staging`: production-like environment for preview, QA, and integration testing
- `production`: customer-facing environment

Rules:

- never use localhost defaults in staging or production
- production secrets must live in the platform secret manager, not in committed files
- staging should mirror production providers where possible

## Video Strategy

Recommended first step:

- use LiveKit Cloud instead of self-hosted media infrastructure

Reason:

- faster time to market
- less operational risk
- easier scaling for multi-region consultation traffic
- simpler monitoring and incident handling

Later review conditions:

- compliance requirements
- cost pressure at scale
- need for custom media topology

## Payment Strategy

Recommended first step:

- use a provider with strong subscription, one-time payment, and webhook support

The payment system must support:

- full payment at booking
- deposit workflows
- package plans
- subscriptions if needed later
- webhook-driven payment state reconciliation
- refund handling

## Scheduling and Reminders

The scheduling system should support:

- expert-managed availability
- booking locks on time slots
- rescheduling rules
- cancellation windows
- timezone-aware booking display

Reminders should be sent:

- at booking confirmation
- before the session start time
- after session completion where summaries or follow-ups are required

Reminder channels:

- email
- SMS
- in-app notifications

## Data Model Priorities

The first production-grade domain model should include:

- users
- experts
- expert profiles
- categories and specialties
- availability blocks
- bookings
- payments
- meeting sessions
- reminders
- reviews

## Security Requirements

- HTTPS everywhere
- signed auth tokens with rotation plan
- role-based authorization
- secure webhook verification
- least-privilege access to infrastructure
- audit logs for critical actions
- encrypted secrets in deployment platforms
- rate limiting on auth, booking, and payment endpoints

## Observability

Minimum production observability should include:

- structured logs for API requests and background jobs
- error reporting for web, mobile, and API
- uptime checks for API and web
- metrics for bookings, payments, and reminder delivery
- alerting for failed payment webhooks and failed meeting creation

## Release Workflow

### Web

- push to staging on merge to the integration branch
- validate env configuration and smoke tests
- promote to production after approval

### Mobile

- `development` EAS profile for internal dev builds
- `preview` EAS profile for QA builds
- `production` EAS profile for store distribution

### API

- deploy with database migration step
- run smoke tests after deploy
- roll back on failed health checks

## Repository Readiness Status

Already in place:

- single monorepo baseline
- app-specific env examples
- environment-aware Turbo hashing
- Expo development-build setup
- shared `packages/platform` package
- smoke tests for API and web

Still needed before real production work:

- real auth stack
- real database and migration tooling
- booking domain implementation
- payment integration
- video provider integration
- reminder worker and provider integration
- staging environment
- CI/CD and release automation

## Decisions To Confirm

The following decisions are still open and should be confirmed before first deployment:

- final Git remote and canonical Go module path
- authentication provider or custom auth approach
- database host and migration tool
- payment provider
- email provider
- SMS provider
- video provider account and token flow
- hosting platform for API
- hosting platform for web
- monitoring and error-tracking provider
