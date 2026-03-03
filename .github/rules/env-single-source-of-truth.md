---
name: Environment Configuration Single Source of Truth
description: Enforces strict environment variable management with .env as the only source of truth, centralized validation, and fail-fast startup behavior.
alwaysApply: true
---

# Environment Configuration: Single Source of Truth

- The `.env` file is the only source of truth for environment variables.
- Do not duplicate environment configuration values as constants, literals, or mirrored mappings in application code.
- Do not implement fallback or default values for required environment variables.
- All environment variable reads must be centralized in a dedicated configuration service.
- The configuration service must validate required variables at startup and throw explicit exceptions for any missing required parameter.
- The application must not start when at least one required environment variable is missing.