# Data Models — API Part

## Persistence Status

- No database schema migration files or ORM entities are currently present in `apps/api/src`.
- PostgreSQL is configured as infrastructure dependency and health-checked at startup.

## Current Domain Contracts (from shared package)

### `TaskStatus` enum

- `Open`, `InProgress`, `Completed`, `Cancelled`, `Archived`
- Transition map enforces lifecycle progression.

### `taskSchema`

- Fields: `id`, `title`, `description`, `status`, `priorityLevel`, `createdAt`, `updatedAt`

### `createTaskSchema`

- Fields: `title`, `description`, `subjectId`, `priorityLevel`, `estimatedDuration`, `deadline`

## Migration Notes

- This project is scaffolded for future CRUD and database schema implementation.
