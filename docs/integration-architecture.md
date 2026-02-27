# Integration Architecture

## Parts and Communication

## 1) Web → API

- **Type:** REST over HTTP
- **Mechanism:** Browser calls `/api/*`; Vite proxy routes to backend in local dev.
- **Primary known endpoint:** `GET /api/health`

## 2) API ↔ Shared

- **Type:** Internal package dependency
- **Mechanism:** Workspace import `@training-bmad-method-todolist/shared`
- **Purpose:** Shared schema/type/constant reuse

## 3) Web ↔ Shared

- **Type:** Internal package dependency
- **Mechanism:** Workspace import `@training-bmad-method-todolist/shared`
- **Purpose:** Contract alignment between frontend and backend

## Environment Integration

- Local stack is orchestrated with Docker Compose (`db`, `api`, `web`).
- API checks PostgreSQL connectivity using `DATABASE_URL` at startup.

## Data and Contract Flow

1. Shared package defines validation and response contracts.
2. API enforces/serves contract-compatible payloads.
3. Web consumes API responses under the same shared domain vocabulary.
