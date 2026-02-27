# Development Guide — Web Part

## Prerequisites

- Node.js >= 22
- pnpm 10+

## Install

```bash
pnpm install
```

## Local Development

```bash
cd apps/web
pnpm dev
```

- Default URL: `http://localhost:5173`
- Dev proxy: `/api` → `http://localhost:3000`

## Build and Preview

```bash
cd apps/web
pnpm build
pnpm preview
```

## Tests

```bash
cd apps/web
pnpm test
```
