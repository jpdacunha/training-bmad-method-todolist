# Development Guide — API Part

## Prerequisites

- Node.js >= 22
- pnpm 10+
- Optional: PostgreSQL (or Docker Compose service)

## Install

```bash
pnpm install
```

## Local Development

```bash
cd apps/api
pnpm dev
```

- Default port: `3000`
- API root: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

## Build and Run

```bash
cd apps/api
pnpm build
pnpm start:prod
```

## Tests

```bash
cd apps/api
pnpm test
```

## Health Verification

```bash
curl http://localhost:3000/api/health
```
