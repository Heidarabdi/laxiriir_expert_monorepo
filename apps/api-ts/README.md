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

### Development demo workspace

When `NODE_ENV=development`, `SEED_DEVELOPMENT_DATA=true`, and a local
`DEVELOPMENT_DEMO_PASSWORD` is configured, startup creates a
loginable demo workspace with weekly availability plus upcoming, past, and
cancelled bookings. The seed is idempotent for the current week and never runs
in production.

Set a fresh, unique password of 16-128 characters in the ignored
`apps/api-ts/.env.local` file as `DEVELOPMENT_DEMO_PASSWORD`. There is no built-in
password. Never commit this value or reuse a real account's password.
Without it, demo account seeding is skipped; the API can still start normally.

These local-only accounts use the configured password:

| Role/state | Email |
| --- | --- |
| Client | `client@laxiriir.local` |
| Approved expert | `expert@laxiriir.local` |
| Second approved expert | `expert.operations@laxiriir.local` |
| Pending expert | `pending.expert@laxiriir.local` |
| Rejected expert | `rejected.expert@laxiriir.local` |
| Suspended expert | `suspended.expert@laxiriir.local` |
| Admin | `admin@laxiriir.local` |

Set `SEED_DEVELOPMENT_DATA=false` to keep a development database free of these
fixtures.

To rotate previously seeded credentials, replace `DEVELOPMENT_DEMO_PASSWORD`
with a fresh value and restart the development API against that development
database. The seed updates the demo accounts' password hashes and revokes their
existing sessions; unrelated accounts are not changed. Repeating the seed with
the same password preserves sessions. Do not run development seeding against a
production database. If demo accounts were ever copied into production, disable
them and revoke their sessions there through an authorized admin procedure.

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
- `PATCH|DELETE /api/v1/client/bookings/:id`
- `GET /api/v1/expert/bookings`
- `GET /api/v1/expert/dashboard`
- `GET|POST /api/v1/expert/availability`
- `PATCH|DELETE /api/v1/expert/availability/:id`
- `GET /api/v1/admin/experts`
- `PATCH /api/v1/admin/experts/:id/:action`

Only `client` and `expert` are accepted as public registration roles. Admin
accounts are bootstrapped from `AUTH_BOOTSTRAP_ADMIN_EMAILS`.
