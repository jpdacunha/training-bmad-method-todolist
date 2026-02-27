# Development Guide — Shared Part

## Purpose

`packages/shared` centralizes reusable schemas, types, and constants consumed by API and Web.

## Commands

```bash
cd packages/shared
pnpm build
pnpm dev
pnpm test
pnpm lint
```

## Authoring Guidelines

- Keep public exports in `src/index.ts`.
- Prefer additive changes to avoid breaking cross-part contracts.
- Use Zod schemas for contract-first validation boundaries.
