# PROGRESS — Document Vault

Update at the END of every session. Be honest, not optimistic — "started,
not working yet" is more useful to future-you than "done" when it isn't.

Last updated: 2026-08-26

## Status: IN PROGRESS

## Phases

- [x] 1. Scaffold — Bun + TS strict config, folder structure, `docker-compose.yml`
- [x] 2. Prisma schema (Collection, Document) + first migration
- [x] 3. GraphQL SDL (`schema.graphql`)
- [x] 4. Query resolvers: `collections`, `collection(id)` with nested documents
- [x] 5. Mutation resolvers + validation: `createCollection`, `createDocument`,
      `updateDocument`, `deleteDocument`
- [x] 6. `moveDocument` mutation
- [x] 7. `documents` query — search + filter + cursor pagination
- [ ] 8. Unit tests for resolvers
- [ ] 9. Integration test(s) against Dockerized Postgres
- [ ] 10. README (one-command setup + extension notes)
- [ ] 11. Bonus: sanity script / Dockerfile / GitHub Actions

## Current task in progress

Phase 8 — Setting up the unit testing environment (Bun test) and mocking Prisma for the resolvers.

## Next task

Phase 9 — Integration testing against Dockerized Postgres.

## Known issues / TODO

- PROGRESS.md and DECISIONS.md were neglected during the coding sprint, making sure to keep them updated now.
- `ARCHITECTURE.md` defines `tests/` and a custom `README.md`, which are currently missing. These will be added in Phases 8, 9, and 10.
