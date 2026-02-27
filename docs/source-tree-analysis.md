# Source Tree Analysis

## Monorepo Structure

```text
training-bmad-method-todolist/
├── apps/
│   ├── api/                    # NestJS backend
│   │   └── src/
│   │       ├── main.ts         # API entry point (global prefix: /api)
│   │       ├── app.module.ts   # Root module
│   │       ├── swagger.config.ts
│   │       ├── database/
│   │       │   └── database-connectivity.service.ts
│   │       └── modules/
│   │           └── health/
│   │               ├── health.controller.ts
│   │               ├── health.controller.test.ts
│   │               └── health.module.ts
│   └── web/                    # React + Vite frontend
│       └── src/
│           ├── main.tsx        # Web entry point
│           ├── app.tsx         # Provider composition
│           ├── routes.tsx      # Router configuration
│           ├── i18n.ts         # Localization bootstrap
│           ├── theme.ts
│           ├── layouts/
│           │   └── app-layout.tsx
│           ├── stores/
│           │   ├── ui.store.ts
│           │   └── language.store.ts
│           └── locales/
│               ├── en.json
│               └── fr.json
├── packages/
│   └── shared/                 # Shared schemas/types/constants
│       └── src/
│           ├── index.ts
│           ├── constants/
│           │   └── task-status.ts
│           ├── schemas/
│           │   ├── auth.schema.ts
│           │   └── task.schema.ts
│           └── types/
│               └── api-response.types.ts
├── scripts/
│   └── verify-app.sh           # Core + smoke verification script
├── docker-compose.yml
├── docker-compose.prod.yml
└── .github/workflows/
    ├── ci.yml
    └── docker-build.yml
```

## Critical Folders Summary

- `apps/api/src`: backend application entry, HTTP controller(s), DB connectivity service.
- `apps/web/src`: frontend entrypoint, routing, global providers, stores, localization.
- `packages/shared/src`: cross-part contracts and enums reused by `api` and `web`.
- `.github/workflows`: CI quality gate and tagged Docker image builds.

## Entry Points

- API: `apps/api/src/main.ts`
- Web: `apps/web/src/main.tsx`
- Shared exports: `packages/shared/src/index.ts`
