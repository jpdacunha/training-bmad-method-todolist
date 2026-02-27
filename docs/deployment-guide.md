# Deployment Guide

## Local Container Stack

- File: `docker-compose.yml`
- Services:
  - `db` (PostgreSQL 16)
  - `api` (NestJS, port 3000)
  - `web` (Vite dev server, port 5173)

Start stack:

```bash
docker compose up --build
```

Preferred project script:

```bash
./scripts/start.sh dev
```

Stop stack:

```bash
./scripts/stop.sh dev
```

Stop + remove volumes:

```bash
./scripts/stop.sh dev --volumes
```

## Production-Oriented Compose

- File: `docker-compose.prod.yml`
- Uses production targets from app Dockerfiles.
- Web serves static build through Nginx on port 80.

Start production stack:

```bash
./scripts/start.sh prod
```

Stop production stack:

```bash
./scripts/stop.sh prod
```

## Docker Build Strategy

- API Dockerfile: base → dependencies → development/build → production
- Web Dockerfile: base → dependencies → development/build → nginx production

## CI/CD

- `ci.yml`: install, lint, format check, build, test on push/PR to `main`.
- `docker-build.yml`: builds production API and Web Docker images on version tags (`v*`).

## Verification

- End-to-end check script: `./scripts/verify-app.sh`
- Modes: `core`, `smoke`, `full`
