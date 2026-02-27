# Architecture — API (`api` part)

## Executive Summary

The API part is a NestJS service exposing REST endpoints under `/api`. Current implementation is intentionally minimal (health endpoint + bootstrap infrastructure) and prepared for future expansion.

## Technology Stack

- NestJS 11 (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`)
- Swagger/OpenAPI via `@nestjs/swagger`
- PostgreSQL client via `pg`
- Shared workspace package `@training-bmad-method-todolist/shared`

## Architecture Pattern

- **Pattern:** Layered modular backend (Nest module/controller/services).
- **Current modules:** `HealthModule` plus `DatabaseConnectivityService` provider.
- **Global conventions:** `/api` prefix, Swagger at `/api/docs`.

## API Design

- Endpoint(s): `GET /api/health`
- Contract style: JSON response with service status and ISO timestamp.
- Documentation: Swagger document generated at startup.

## Data Architecture

- No ORM entities or migrations currently in this part.
- Runtime PostgreSQL connectivity check is performed on bootstrap when `DATABASE_URL` is set.

## Testing Strategy

- Framework: Jest + `@nestjs/testing` + `supertest`.
- Includes unit + integration style checks for health controller.

## Deployment Notes

- Development target: Nest watch mode (`pnpm dev`).
- Production target: `node dist/main` in container.
- Docker multi-stage build defined in `apps/api/Dockerfile`.
