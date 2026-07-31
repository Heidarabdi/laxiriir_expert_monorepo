# TypeScript API Migration

Last reviewed: 2026-07-31

## Status: complete

The backend has moved from Go and SuperTokens to a single TypeScript service:

- Fastify 5 and TypeScript
- Better Auth
- Drizzle ORM and PostgreSQL
- Zod request/response validation
- OpenAPI and Swagger UI
- Vitest with embedded PostgreSQL integration tests

The Go API and local SuperTokens infrastructure have been removed. Nuxt now
uses Better Auth endpoints for registration, sign-in, sign-out, verification,
password recovery, and sessions. Web and mobile API defaults point to port
`8081`.

The domain migration uses `IF NOT EXISTS` for the former Go-owned tables, so
existing expert, availability, booking, and application-profile records are
preserved. Legacy identities keep their IDs (or are reconciled by normalized
email when a Better Auth account already exists), so historical bookings remain
attached to their owners. SuperTokens sessions and password credentials are not
compatible with Better Auth; migrated users must reset their password and verify
their email before signing in.

## Migrated contracts

- `GET /health`
- `GET /api/v1/ping`
- Better Auth endpoints under `/api/auth/*`
- `GET /api/v1/me`
- `GET /api/v1/experts`
- `GET /api/v1/experts/:id/availability`
- `GET|POST /api/v1/client/bookings`
- `PATCH /api/v1/admin/experts/:id/approve`
- `PATCH /api/v1/admin/experts/:id/reject`
- `PATCH /api/v1/admin/experts/:id/suspend`

## Local commands

```bash
pnpm install
pnpm --filter api-ts db:migrate
pnpm --filter api-ts dev
```

The API defaults to `http://localhost:8081`; OpenAPI UI is available at
`http://localhost:8081/documentation`. PostgreSQL is required for the running
API. Tests use embedded PostgreSQL and do not require Docker.
