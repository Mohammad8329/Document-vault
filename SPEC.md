# SPEC — Document Vault GraphQL API

> This file is ground truth. Paste the original assignment below verbatim
> and never edit the "Assignment (verbatim)" section — if requirements
> change, add a "Clarifications" section instead so history is preserved.
> The agent should re-read this file at the start of every session.

## Assignment (verbatim)

Build a small Document Vault backend API using Bun, TypeScript, GraphQL
Yoga, PostgreSQL, and Prisma.

**Stack constraints**
- Bun + TypeScript in strict mode, no `any`
- GraphQL Yoga, schema-first (`.graphql` file + resolvers)
- PostgreSQL via Docker Compose
- Prisma, all schema changes via real `prisma migrate dev` migrations
  (no hand-written/hand-edited SQL)

**Domain**
- `Collection` — id, name, slug, createdAt
- `Document` — id, title, content, tags (string list), collectionId,
  isArchived, createdAt

**Required operations**
- Query: `collections`
- Query: `collection(id)` — with nested documents
- Query: `documents(collectionId, search, isArchived)` — search = substring
  match on title OR content
- Mutation: `createCollection`
- Mutation: `createDocument`
- Mutation: `updateDocument`
- Mutation: `deleteDocument`
- Mutation: `moveDocument(id, collectionId)`
- Cursor-based pagination on `documents` (`take` / `cursor`)

**Validation (real GraphQL errors, not 500s)**
- Reject empty title
- Reject empty content
- Reject malformed slug

**Testing**
- Unit tests for resolvers
- At least one integration test against the Dockerized Postgres

**Explicitly OUT of scope** — do not build:
- Authentication / RBAC / permissions
- GraphQL Federation
- Redis or any caching layer
- Deployment

**Deliverables**
- GitHub repo, incremental commits with real messages
- PR against your own `main` with a short tradeoffs description
- 5–10 min walkthrough (Loom or written) of implementation + key decisions
- README: one-command setup —
  `docker compose up -d && bun install && bun run gendb && bun run dev`
  — plus a short note on how you'd extend the design

**Bonus (optional, no penalty for skipping)**
- `bun run sanity` — lint + typecheck + tests in one command
- Dockerfile for the service itself
- Minimal GitHub Actions workflow: lint + tests on PR open

**Submission**
- Submit via https://burdenoff.com/careersubmissions
- Must use email shaikhmohummad86@gmail.com
- Deadline: 27 August

## Clarifications / assumptions made during build

<!-- Add entries here if you interpret an ambiguous requirement a
     particular way, e.g.:
- "Malformed slug" interpreted as: lowercase letters, numbers, hyphens
  only, no leading/trailing hyphen, regex `^[a-z0-9]+(-[a-z0-9]+)*$`
-->
