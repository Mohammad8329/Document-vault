# DECISIONS — Document Vault

A running log of decisions and *why*. Short entries. This doubles as your
source material for the walkthrough video/writeup at the end — write these
in your own words after the agent explains its reasoning to you, not as a
copy-paste of what the agent said.

Format:
```
## [date] Decision title
- What: ...
- Why: ...
- Alternatives considered: ...
```

## [2026-08-26] Prisma Version Downgrade
- What: Downgraded Prisma from `8.0.0-rc.12` to `5.22.0`.
- Why: The RC version removed the `migrate` command (replaced with `migration`) and using a pre-release version for a take-home assignment is risky due to potential undocumented breaking API changes.
- Alternatives considered: Using `bunx prisma migration dev` and adapting to the v8 RC (rejected — too much risk of hitting other breaking changes in Prisma Client).

---

## [example — delete once real entries exist] Cursor pagination field choice

- What: paginate `documents` using `(createdAt, id)` as the cursor,
  encoded as a base64 string of `"<createdAt_iso>_<id>"`.
- Why: `createdAt` alone isn't unique enough to guarantee stable
  ordering if two documents are created in the same millisecond;
  `id` (cuid, lexically sortable-ish but not by creation time) as a
  tiebreaker guarantees a total order.
- Alternatives considered: offset pagination (rejected — assignment
  explicitly asks for cursor-based); `id`-only cursor (rejected — id
  isn't ordered by creation time, so pagination order would be
  meaningless to a user browsing "newest first").
