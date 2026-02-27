# Project Overview

## Summary

training-bmad-method-todolist is a pnpm/turborepo monorepo that delivers a TodoList platform with a NestJS backend API, a React web frontend, and a shared TypeScript package for schemas/types/constants.

## Repository Classification

- **Repository type:** Monorepo (multi-part)
- **Parts:** 3 (`api`, `web`, `shared`)
- **Primary language:** TypeScript
- **Package manager:** pnpm
- **Task runner:** Turborepo

## Technology Stack

| Category | Technology | Version/Notes |
|---|---|---|
| Runtime | Node.js | >=22 |
| Workspace | pnpm workspace | `pnpm-workspace.yaml` |
| Monorepo orchestration | Turborepo | `turbo.json` |
| Backend | NestJS + Swagger + pg | `apps/api` |
| Frontend | React 19 + Vite + MUI | `apps/web` |
| Frontend state | Zustand + React Query + i18next | `apps/web/src` |
| Shared package | Zod schemas + TS types | `packages/shared` |
| Testing | Jest (API), Vitest (Web/Shared) | package-level configs |
| Deployment | Docker, Docker Compose, Nginx | root + app Dockerfiles |
| CI/CD | GitHub Actions | `.github/workflows` |

## Architecture Snapshot

- `web` calls `api` via `/api/*` (proxied by Vite in development).
- `api` exposes REST endpoints with global prefix `/api`.
- `web` and `api` both consume `@training-bmad-method-todolist/shared`.
- PostgreSQL connectivity check is executed during API bootstrap when `DATABASE_URL` is available.

## Generated Documentation

- Architecture docs per part
- API contracts per relevant part
- Data model docs per relevant part
- Component inventory for frontend
- Source tree analysis
- Integration architecture
- Development guides per part
- Deployment guide
