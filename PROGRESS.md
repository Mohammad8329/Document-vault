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
- [x] 8. Unit tests for resolvers
- [x] 9. Integration test(s) against Dockerized Postgres
- [x] 10. README (one-command setup + extension notes)
- [ ] 11. Bonus: sanity script / Dockerfile / GitHub Actions

## Current task in progress

Phase 11 — Implementing bonus tasks: sanity script, Dockerfile, and GitHub Actions workflow.

## Next task

Project Completion and Final Walkthrough.

## Known issues / TODO

- PROGRESS.md and DECISIONS.md were neglected during the coding sprint, making sure to keep them updated now.
- `ARCHITECTURE.md` defines `tests/` and a custom `README.md`, which have now been added.
