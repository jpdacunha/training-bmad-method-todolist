# Architecture — Shared (`shared` part)

## Executive Summary

The shared part is a lightweight TypeScript library exposing reusable domain contracts (Zod schemas, TS types, constants) consumed by both API and Web parts.

## Technology Stack

- TypeScript
- Zod 4
- Vitest for unit tests

## Architecture Pattern

- **Pattern:** Contract-first shared package.
- Public surface is centralized through `src/index.ts` re-exports.

## Domain Contracts

- Schemas: `auth.schema.ts`, `task.schema.ts`
- Types: `api-response.types.ts`
- Constants: `task-status.ts` (state machine enums and transitions)

## Integration Role

- Enables consistent validation and typing boundaries across frontend and backend.
- Reduces duplication of request/response and task-domain definitions.
