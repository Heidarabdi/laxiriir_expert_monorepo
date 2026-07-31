# TypeScript API Migration

Last reviewed: 2026-07-31

## Decision

The replacement API stack is:

- Fastify 5 and TypeScript
- Better Auth
- Drizzle ORM and PostgreSQL
- Zod validation
- OpenAPI and Swagger UI
- Vitest with embedded PostgreSQL integration tests
- BullMQ when background jobs are introduced

Drizzle was selected instead of Prisma. Fastify remains intentionally modular,
while the application package includes the production plugins needed for
security, validation, documentation, authentication, and database access.

## Migration rule

This is a strangler migration. `apps/api-ts` and the existing Go API run side
by side. A route moves only after its existing public contract is captured by
tests and its TypeScript replacement passes those tests.

The Go API and `infra/supertokens` must not be deleted until the Nuxt and Expo
clients use Better Auth and all domain routes have moved.

## Current status

Milestone 1 is implemented:

- Fastify server factory and autoloaded plugins/routes
- validated environment configuration
- security headers, CORS, rate limits, and safe structured errors
- Zod request/response integration
- generated OpenAPI document and Swagger UI
- Drizzle PostgreSQL client and committed migration
- Better Auth registration, sign-in, sessions, and role persistence
- public registration restricted to `client` and `expert`
- health, ping, config, error, OpenAPI, registration, and sign-in tests
- production entry point with redacted structured logs and graceful shutdown

The Nuxt application still calls SuperTokens. Login and registration in the
browser will use the new API only after the web auth client is migrated.

## Route migration order

1. Add Better Auth email verification and password recovery delivery.
2. Replace the Nuxt SuperTokens client with Better Auth and verify browser
   registration, sign-in, sign-out, and session hydration.
3. Add an authenticated Fastify route guard and migrate `GET /api/v1/me`.
4. Migrate expert discovery and availability.
5. Migrate booking creation and history.
6. Migrate admin expert moderation.
7. Move the Expo client, then remove the Go API and SuperTokens infrastructure.

## Local commands

```bash
pnpm install
pnpm --filter api-ts db:migrate
pnpm --filter api-ts dev
```

The TypeScript API defaults to port `8081` while the Go API remains on `8080`.
Its OpenAPI UI is available at `http://localhost:8081/documentation`.
