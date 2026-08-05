# Project Handoff

Last reviewed: 2026-07-31

## Current status

The backend overhaul is complete. The repository now has one API implementation
in `apps/api-ts`; the Go API and SuperTokens infrastructure were removed.
Existing domain rows are preserved by the migration. SuperTokens sessions and
password credentials are not portable, so pre-migration users must register or
reset their credentials in Better Auth.

Current stack:

- Nuxt 4 web application
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
- the preserved legacy `apps/api/.env.local` only if it contains values you
  still need to transfer manually

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

## Next product work

1. Expert-managed availability creation and editing.
2. Booking cancellation and rescheduling.
3. Payments and webhook reconciliation.
4. Managed video rooms and access tokens.
5. Reminders, notifications, ratings, and consultation history.
