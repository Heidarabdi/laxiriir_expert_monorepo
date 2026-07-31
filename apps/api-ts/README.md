# Laxiriir Expert TypeScript API

This is the primary Laxiriir Expert API. It uses Fastify, Better Auth, Drizzle,
PostgreSQL, Zod, and OpenAPI.

## Local setup

Copy `.env.example` to `.env.local` and provide a PostgreSQL database plus a
random Better Auth secret of at least 32 characters.

Apply migrations and start the server:

```bash
pnpm --filter api-ts db:migrate
pnpm --filter api-ts dev
```

The default API address is `http://localhost:8081`. OpenAPI documentation is
available at `http://localhost:8081/documentation`.

## Useful commands

```bash
pnpm --filter api-ts test
pnpm --filter api-ts typecheck
pnpm --filter api-ts lint
pnpm --filter api-ts build
pnpm --filter api-ts db:generate
```

Auth integration tests use embedded PostgreSQL and do not require Docker.
The running application still requires PostgreSQL, but it no longer requires a
separate SuperTokens Core service.

## Implemented contracts

- `GET /health`
- `GET /api/v1/ping`
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- Better Auth session endpoints under `/api/auth/*`
- `GET /api/v1/me`
- `GET /api/v1/experts`
- `GET /api/v1/experts/:id/availability`
- `GET|POST /api/v1/client/bookings`
- `PATCH /api/v1/admin/experts/:id/:action`

Only `client` and `expert` are accepted as public registration roles. Admin
accounts are bootstrapped from `AUTH_BOOTSTRAP_ADMIN_EMAILS`.
