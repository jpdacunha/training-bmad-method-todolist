# Project Documentation Index

Back to repository overview: [README.md](../README.md)

## Project Overview

- **Type:** monorepo with 3 parts
- **Primary Language:** TypeScript
- **Architecture:** Multi-part (Web + API + Shared contracts)

## Quick Reference by Part

### API (`api`)

- **Type:** backend
- **Tech Stack:** NestJS, Swagger, pg
- **Root:** `apps/api`

### Web (`web`)

- **Type:** web
- **Tech Stack:** React, Vite, MUI, Zustand, React Query, i18next
- **Root:** `apps/web`

### Shared (`shared`)

- **Type:** library
- **Tech Stack:** TypeScript, Zod
- **Root:** `packages/shared`

## Generated Documentation

- [Project Overview](./project-overview.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Architecture — API](./architecture-api.md)
- [Architecture — Web](./architecture-web.md)
- [Architecture — Shared](./architecture-shared.md)
- [Integration Architecture](./integration-architecture.md)
- [API Contracts — API](./api-contracts-api.md)
- [API Contracts — Web](./api-contracts-web.md)
- [Data Models — API](./data-models-api.md)
- [Data Models — Web](./data-models-web.md)
- [Component Inventory — Web](./component-inventory-web.md)
- [Development Guide — API](./development-guide-api.md)
- [Development Guide — Web](./development-guide-web.md)
- [Development Guide — Shared](./development-guide-shared.md)
- [Deployment Guide](./deployment-guide.md)
- [Project Parts Metadata](./project-parts.json)

## Existing Documentation Discovered

- No existing project documentation files were found in `docs/`, `documentation/`, or repository root README/CONTRIBUTING locations at scan time.

## Getting Started

1. Read [Project Overview](./project-overview.md).
2. Jump to the part-specific architecture file you need.
3. Use [Integration Architecture](./integration-architecture.md) for cross-part feature planning.
4. For implementation workflows, treat this file as the primary retrieval entry point.
