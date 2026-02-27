# training-bmad-method-todolist

Daily execution cockpit for busy freelancers — intelligent task prioritization with a living 5-day plan.

## Documentation

Project documentation is generated and maintained in the `docs/` folder.

- Start here: [docs/index.md](docs/index.md)
- Architecture: `docs/architecture-*.md`
- Development guides: `docs/development-guide-*.md`
- Deployment: `docs/deployment-guide.md`
- Integration: `docs/integration-architecture.md`

## Monorepo Structure

- `apps/api` — NestJS backend
- `apps/web` — React + Vite frontend
- `packages/shared` — shared schemas/types/constants

## Quick Start

```bash
pnpm install
pnpm dev
```

## Docker Compose Stack

```bash
./scripts/start.sh
./scripts/stop.sh
```

Modes:

- `./scripts/start.sh dev|prod`
- `./scripts/stop.sh dev|prod [--volumes]`

## Verification

```bash
./scripts/verify-app.sh full
```
