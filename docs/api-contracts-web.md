# API Contracts — Web Part (Consumed APIs)

## API Consumption Boundary

- Frontend expects backend endpoints under `/api/*`.
- Development traffic is proxied by Vite to `http://localhost:3000`.

## Known Consumed Endpoint

- `GET /api/health` (used by smoke checks and environment validation workflows).

## Contract Strategy

- Shared API envelope conventions are defined in `@training-bmad-method-todolist/shared` (`ApiResponse`, `ApiError`).
- Additional feature contracts are expected to be introduced via shared schemas as implementation progresses.
