# Document Vault

A GraphQL backend API built with **Bun**, **TypeScript**, **GraphQL Yoga**, **PostgreSQL**, and **Prisma**.

## One-Command Setup

To run this project locally, ensure you have [Bun](https://bun.sh/) and [Docker](https://www.docker.com/) installed. Then, simply run:

```bash
docker compose up -d && bun install && bun run gendb && bun run dev
```

The GraphQL server will be available at [http://localhost:4000/graphql](http://localhost:4000/graphql) (Yoga provides an interactive GraphiQL IDE here).

### Running Tests

We have two suites of tests powered by `bun:test`:
- **Unit Tests** (Mocks the database, runs instantly): `bun run test`
- **Integration Tests** (Requires the Dockerized DB to be running): `bun test tests/integration`

## How I Would Extend the Design

If this project were to go to production and needed to scale, I would make the following architectural changes:

1. **Caching Layer**: I would introduce Redis to cache frequently accessed queries (like popular `collections`). The cursor-based pagination makes caching the `documents` query slightly tricky, so we'd cache by `collectionId` + sorting keys and invalidate the cache upon document mutations.
2. **Dataloader (N+1 Problem)**: Currently, if we query 100 collections and ask for their nested documents, we might trigger 100 separate database queries. I would implement `DataLoader` (which batches and caches database calls within a single request) inside the `Collection.documents` resolver to fetch all documents for all collections in a single `findMany` call using `in: collectionIds`.
3. **Authentication / RBAC**: I would extract a reusable directive or middleware in Yoga to check for a valid JWT (passed via headers and decoded into the GraphQL Context) before allowing mutations. We would attach the `userId` to the Document model to ensure users can only modify their own vaults.
4. **GraphQL Federation**: If the system grew into multiple microservices (e.g. a separate service for handling PDF parsing vs the main vault service), I'd use Apollo Federation so the frontend could query a single supergraph while keeping the codebases cleanly decoupled.
