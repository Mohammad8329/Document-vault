# PROGRESS — Document Vault

Update at the END of every session. Be honest, not optimistic — "started,
not working yet" is more useful to future-you than "done" when it isn't.

Last updated: 2026-08-29

## Status: IN PROGRESS (Frontend)

---

## Backend Phases (Complete — merged to `main`)

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
- [x] 11. Bonus: sanity script / Dockerfile / GitHub Actions
- [x] 12. Fix cursor pagination — changed `@@index` to `@@unique([createdAt, id])`
- [x] 13. PR raised, submission delivered via burdenoff.com

---

## Frontend Phases (`frontend` branch — in progress)

- [x] 1. Scaffold Next.js 14 app inside `client/`, install Apollo Client,
      set up global CSS with design tokens and dark/light mode variables
- [ ] 2. Build Sidebar + Dashboard layout using `collections` query
- [ ] 3. Build Collection detail page (`/collections/[id]`) with `DocumentCard`
- [ ] 4. Build `CreateCollectionForm` and `CreateDocumentForm` modals
- [ ] 5. Wire up `updateDocument` (archive toggle), `deleteDocument`, `moveDocument` actions
- [ ] 6. Build `/search` page with debounced search + cursor "Load More" pagination
- [ ] 7. Polish — dark/light mode, animations, responsive layout, update README

## Current task in progress

Frontend Phase 2 — Sidebar + Dashboard layout with `collections` query.

## Next task

Frontend Phase 3 — Collection detail page (`/collections/[id]`) with `DocumentCard`.

## Known issues / TODO

- README.md will need a new "Client Setup" section once all frontend phases are complete.
