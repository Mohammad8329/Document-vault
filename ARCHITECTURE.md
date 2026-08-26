# ARCHITECTURE — Document Vault

Living document. Update whenever a structural decision is made or changed.
The agent should treat this as binding — if it wants to deviate, it should
say so explicitly and ask, not silently do something else.

## Folder structure (target)

```
.
├── docker-compose.yml
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── schema/
│   │   └── schema.graphql        # SDL, schema-first
│   ├── resolvers/
│   │   ├── collection.resolvers.ts
│   │   ├── document.resolvers.ts
│   │   └── index.ts              # merged resolver map
│   ├── validation/
│   │   └── rules.ts              # slug regex, title/content checks
│   ├── errors/
│   │   └── errors.ts             # typed GraphQLError helpers
│   ├── context.ts                # builds { prisma } context per request
│   ├── prisma.ts                 # singleton PrismaClient
│   └── server.ts                 # Yoga server entrypoint
├── tests/
│   ├── unit/
│   └── integration/
├── SPEC.md
├── ARCHITECTURE.md
├── PROGRESS.md
├── DECISIONS.md
└── README.md
```

## Key decisions (see DECISIONS.md for full rationale log)

- **Schema-first**: `.graphql` SDL is the contract; resolvers implement it.
  Never hand-write TS types that duplicate the SDL — generate or derive
  where possible.
- **Validation location**: happens in a dedicated `validation/` layer
  called at the top of each mutation resolver, before any Prisma call.
  Keeps resolvers thin and validation testable in isolation (unit tests
  don't need a DB).
- **Errors**: all validation/not-found errors thrown as `GraphQLError`
  with `extensions.code` (e.g. `BAD_USER_INPUT`, `NOT_FOUND`). No bare
  `throw new Error(...)` — those surface as opaque 500s.
- **Pagination**: cursor-based on `documents`, ordered by `createdAt`
  (with `id` as tiebreaker since `createdAt` isn't unique). Cursor encodes
  `(createdAt, id)`.
- **Prisma client**: single instance, instantiated once in `prisma.ts`,
  reused across requests via context — not re-instantiated per request.
- **Tests**: unit tests mock the Prisma client (no DB needed, fast).
  Integration test(s) spin up against the real Dockerized Postgres and
  exercise at least one full mutation → query round trip.

## Open questions / things to revisit

<!-- Keep this section honest — if something is a placeholder or a
     "good enough for now" choice, note it here so it doesn't get
     mistaken for a deliberate final decision. -->
