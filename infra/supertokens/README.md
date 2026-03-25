# SuperTokens Local Infrastructure

This directory contains the local and CI auth scaffolding for Laxiriir Expert.

## Scope

- `docker-compose.yml` runs the local SuperTokens Core stack
- PostgreSQL is the backing store for local identity and session data
- Mailpit is included as a development mail sink for verification and recovery flows

## Deployment Model

The project supports two SuperTokens deployment models:

- local development and CI: self-hosted Core from this directory
- production: managed Core is the recommended first deployment path, with self-hosted Core still supported later

## Notes

- The current Go and Nuxt runtime code is still in transition from the temporary Authula spike.
- This scaffold exists so the repo reflects the final auth direction before the full runtime swap lands.
- Google sign-in is intentionally not enabled yet. The project should prepare for it through SuperTokens `ThirdPartyEmailPassword`, then add provider secrets later.
