# Document Vault GraphQL API

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

A high-performance, strictly-typed GraphQL backend API designed for managing documents across nested collections (vaults). Built from the ground up using **schema-first GraphQL Yoga**, powered by **Bun**, and backed by **PostgreSQL**.

---

## Features

- **Collections & Documents**: Full CRUD operations for creating, managing, and moving documents between structured vaults.
- **Deep Search**: Built-in substring search functionality to scan both document titles and contents simultaneously.
- **Cursor Pagination**: Robust cursor-based pagination implemented via stable composite keys `(createdAt, id)`.
- **Custom Validation**: Strict input validation layer returning idiomatic, typed GraphQL Errors (e.g., `BAD_USER_INPUT`) rather than opaque 500 crashes.
- **Complete Test Suite**: End-to-end integration tests via real Dockerized Postgres + lightning-fast mocked unit tests.

---

## Quick Start (One-Command Setup)

> **Note**: Ensure you have [Bun](https://bun.sh/) and [Docker](https://www.docker.com/) running on your machine before starting.

To spin up the entire ecosystem (database, dependencies, migrations, and server), simply run:

```bash
docker compose up -d && bun install && bun run gendb && bun run dev
```

The GraphQL interactive playground (GraphiQL) will be instantly available at:
**[http://localhost:4000/graphql](http://localhost:4000/graphql)**

---

## Frontend Web Client (Next.js 14 App Router)

A full-stack, responsive web application for interacting with the Document Vault GraphQL API is located in the `client/` directory.

### Running the Frontend:

1. Open a new terminal in the `client/` folder:
   ```bash
   cd client
   bun install
   bun run dev
   ```
2. Open your browser and navigate to:
   **[http://localhost:3000](http://localhost:3000)**

### Key Frontend Features:
- **Vault Management**: Visual dashboard for browsing, creating, and inspecting vaults.
- **Document Studio**: Full CRUD interface for creating, editing, archiving, and moving markdown documents between collections.
- **Global Search**: Real-time debounced substring search across all document titles and contents with live filters.
- **Cursor Pagination**: "Load More" interface powered by GraphQL cursor-based pagination.
- **Theme Support**: Seamless dark and light mode toggle with glassmorphism aesthetics.

---

## Testing & CI

We use `bun:test` to ensure maximum stability. The project is split into two test suites:

- **Sanity Check (Lint + Typecheck + Tests)**: 
  ```bash
  bun run sanity
  ```
- **Unit Tests** (Mocks the DB, runs instantly): 
  ```bash
  bun run test
  ```
- **Integration Tests** (Requires the Dockerized Postgres DB to be running): 
  ```bash
  bun run test:integration
  ```

*This repository also includes a fully configured **GitHub Actions** CI/CD pipeline that natively spins up Postgres and runs all integration tests on every PR!*

---

## Extending for Production Scale

If this project were to go to production and experience high throughput, I would introduce the following architectural extensions:

### 1. Dataloader (N+1 Optimization)
Currently, querying multiple collections and asking for their nested documents triggers separate database queries (the N+1 problem). I would implement `DataLoader` inside the `Collection.documents` resolver to batch and cache database calls within a single request, fetching all documents in a single `findMany { in: collectionIds }` sweep.

### 2. Intelligent Caching (Redis)
I would introduce a Redis caching layer for frequently accessed, read-heavy queries. Since cursor-based pagination makes caching dynamic lists tricky, we'd cache specific blocks by `collectionId` + sorting keys and use mutation hooks to safely invalidate the cache upon edits.

### 3. Authentication & RBAC
To secure the vault, I would extract a reusable GraphQL Directive or Yoga Envelop plugin to intercept requests. It would decode a JWT from the HTTP headers, inject the `userId` into the GraphQL Context, and assert ownership constraints against the Prisma models before allowing mutations.

### 4. GraphQL Federation
If the system's scope grew (for example, building a separate heavy microservice just for PDF OCR text-extraction), I would migrate the schema to Apollo Federation. This allows the frontend to query a single unified Supergraph while keeping our service codebases cleanly decoupled.
