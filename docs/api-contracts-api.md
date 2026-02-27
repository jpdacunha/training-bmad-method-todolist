# API Contracts — API Part

## Public Endpoints

### `GET /api/health`

- **Purpose:** Service liveness check
- **Auth:** None
- **Response 200:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-27T12:00:00.000Z"
}
```

## Documentation Exposure

- Swagger UI: `/api/docs`
- OpenAPI title: `Training BMad Method TodoList API`

## Planned Expansion Notes

- TODO markers in bootstrap indicate upcoming global validation and standardized error handling middleware.
