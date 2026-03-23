# Laxiriir Expert Planning

This document is the primary planning document for the project.

It combines:

- web page planning
- MVP scope
- backend scope
- testing requirements
- delivery phases
- release readiness

Supporting documents:

- [README.md](./README.md)
- [PRODUCTION.md](./PRODUCTION.md)

## Product Goal

Laxiriir Expert is a video-first consultation platform where:

- clients discover experts, review trust and availability, book sessions, pay, and attend consultations
- experts manage profiles, calendars, sessions, messages, and earnings
- admins manage trust, finance, users, bookings, and platform operations

The product must work as one coherent system across:

- public marketing
- authenticated client flows
- expert operations
- admin operations

## Roles

- `Client`
- `Expert`
- `Admin`

## Planning Principles

- build by vertical slice, not by frontend-only or backend-only silos
- use Stitch screens as design references, not as route definitions
- avoid duplicate routes when multiple Stitch screens describe the same responsibility
- prioritize real domain workflows over placeholder dashboard surfaces
- treat testing, security, and release readiness as part of delivery, not late-stage cleanup

## Canonical Web Product Surface

### Public Pages

- `/`
  - landing page
- `/experts`
  - expert directory
- `/experts/[id]`
  - expert profile
- `/pricing`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/faq`
  - needed soon

### Auth Pages

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`

### Client Pages

- `/client`
  - client dashboard
- `/client/bookings`
  - bookings list
- `/client/bookings/new/[expertId]`
  - booking and schedule flow
- `/client/bookings/[bookingId]`
  - booking detail, payment state, cancel, reschedule
- `/sessions/[sessionId]`
  - live session room
- `/client/messages`
  - post-MVP
- `/client/summaries/[bookingId]`
  - post-MVP
- `/client/profile`
  - post-MVP
- `/client/billing`
  - post-MVP
- `/client/saved-experts`
  - post-MVP
- `/client/notifications`
  - post-MVP

### Expert Pages

- `/expert`
  - expert dashboard
- `/expert/calendar`
  - availability and schedule management
- `/expert/bookings`
  - expert booking list
- `/expert/earnings`
  - earnings and payouts
- `/expert/messages`
  - post-MVP
- `/expert/profile`
  - post-MVP
- `/expert/settings`
  - post-MVP
- `/expert/sessions/[sessionId]`
  - may share the main live session room with role-based UI

### Admin Pages

- `/admin`
  - admin dashboard
- `/admin/finance`
  - payments, payouts, refunds
- `/admin/bookings`
  - booking operations
- `/admin/experts`
  - expert verification and management
- `/admin/users`
  - user management
- `/admin/support`
  - post-MVP or late MVP depending on support load
- `/admin/analytics`
  - post-MVP or later MVP depending on data readiness

## Stitch Design Mapping

These are the main Stitch screens that should guide implementation:

- `Home Page Rebuild` -> `/`
- `Expert Directory` -> `/experts`
- `Expert Profile` -> `/experts/[id]`
- `Booking & Schedule` -> `/client/bookings/new/[expertId]`
- `Client Command Center` -> `/client`
- `Expert Command Center` -> `/expert`
- `Calendar & Scheduling` -> `/expert/calendar`
- `Earnings & Payouts` -> `/expert/earnings`
- `Live Session Command` -> `/sessions/[sessionId]`
- `Messaging Center` -> messaging pages
- `Financial Command` -> `/admin/finance`
- `Professional CRM` -> `/admin/users`

Treat these as variants, not separate routes:

- `Client Directory`
- `Client Command Center (Enhanced)`
- `Expert Dashboard`
- `Financial Hub`
- `Live Session: Marcus Chen`

## MVP Definition

MVP is not “all pages”.

MVP is one complete web consultation workflow that is real, persistent, and testable.

### MVP Pages

#### Public

- `/`
- `/experts`
- `/experts/[id]`
- `/pricing`
- `/about`
- `/contact`
- `/privacy`
- `/terms`

#### Auth

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

#### Client

- `/client`
- `/client/bookings`
- `/client/bookings/new/[expertId]`
- `/client/bookings/[bookingId]`
- `/sessions/[sessionId]`

#### Expert

- `/expert`
- `/expert/calendar`
- `/expert/bookings`
- `/expert/earnings`

#### Admin

- `/admin`
- `/admin/finance`
- `/admin/bookings`
- `/admin/experts`

## MVP Backend Scope

### Core Domain Models

- users
- roles
- expert profiles
- categories and specialties
- availability blocks
- bookings
- booking status transitions
- payments
- session records

### Core API Surface

- auth endpoints
- expert list endpoint
- expert detail endpoint
- expert availability endpoint
- create booking endpoint
- client bookings list endpoint
- booking detail endpoint
- expert bookings endpoint
- expert availability mutation endpoints
- admin bookings endpoint
- admin expert review endpoints

### Core Infrastructure

- database
- migrations
- authentication
- authorization
- payment integration
- video provider integration
- webhook verification and reconciliation
- background jobs for reminders and retries

## MVP Testing Requirements

### Frontend

- route smoke checks
- booking flow UI checks
- auth form checks
- responsive checks for core screens

### Backend

- route tests
- authorization tests
- booking rule tests
- payment webhook tests
- session access tests

### End-to-End

- browse experts -> book session
- login -> client dashboard access
- expert updates availability
- admin reviews booking state
- successful payment produces a valid booking state
- authorized user joins live session room

### Manual QA

- registration and login
- booking success
- booking cancellation
- booking reschedule
- dashboard navigation
- payment success and failure states
- session join flow

## Non-Page MVP Requirements

### Security

- role-protected routes
- server-side authorization
- secure secret handling
- webhook verification
- auditability for booking and finance actions

### Observability

- structured logs
- frontend error reporting
- API error reporting
- uptime monitoring
- alerts for payment and session failures

### Content and Legal

- production-ready pricing copy
- cancellation and refund policy copy
- support contact path
- legal pages complete enough for launch

## Post-MVP Scope

### Client

- messaging
- session summaries
- billing center
- saved experts
- notification center

### Expert

- messaging
- profile editing
- settings

### Admin

- support queue
- analytics
- broader user administration tooling

### Product Enhancements

- richer reviews and trust systems
- consultation history improvements
- advanced analytics
- subscription and package models
- AI matching
- AI summaries
- AI preparation assistance

## Recommended Delivery Order

### Phase 1: Discovery and Booking

- expert directory
- expert profile
- authentication baseline
- booking and schedule flow
- client bookings list and detail

### Phase 2: Payment and Session

- payment integration
- booking payment state
- live session room

### Phase 3: Expert Operations

- expert dashboard
- expert calendar
- expert booking management
- expert earnings

### Phase 4: Admin Operations

- admin dashboard
- admin finance
- admin bookings
- admin experts

### Phase 5: Post-MVP Expansion

- messaging
- summaries
- support
- analytics
- AI features

## Release Gate

Do not call MVP ready unless all of these are true:

- MVP pages exist in working form
- MVP backend exists in persistent form
- booking data is not local-only
- payment integration works in staging
- live session access works in staging
- role-based access works
- automated tests for the critical booking flow pass
- staging smoke checks pass
- admin can inspect booking and finance records

## Current Reality In Repo

What exists already:

- public pages baseline
- expert directory and profile baseline
- interim booking list baseline
- auth UI shells

What does not exist yet:

- real client dashboard
- expert dashboard
- admin dashboard
- persistent booking backend
- real payment integration
- real live session infrastructure
- real role-based dashboards

## Immediate Next Step

The next correct implementation step is:

1. finalize the booking routes around the Stitch `Booking & Schedule` rail
2. define shared backend contracts for experts, availability, and bookings
3. replace local booking state with real API persistence
4. then build the real client dashboard on top of that data
