# API Database Migrations

The API supports SQLite for local tests and PostgreSQL for deployed environments.

The application currently creates missing tables at startup for local development.
Production PostgreSQL environments should apply the committed migrations before
deploying a new API version.

Apply the initial migration with `psql`:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/001_initial_domain.up.sql
```

Rollback is destructive and should only be used with a verified backup:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/001_initial_domain.down.sql
```
