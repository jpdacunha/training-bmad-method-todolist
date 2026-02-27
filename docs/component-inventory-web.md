# Component Inventory — Web Part

## Layout Components

- `AppLayout` (`layouts/app-layout.tsx`)
  - App shell with header bar
  - Theme toggle button
  - Language switch button
  - Nested route outlet region

## Routing Components

- `AppRoutes` (`routes.tsx`)
  - `BrowserRouter` root
  - Layout-protected root route (`/`)
  - Public login route (`/login`)
  - Placeholder route elements for MVP scaffolding

## Root Composition

- `App` (`app.tsx`)
  - Query client setup
  - Theme provider wiring
  - Global CSS baseline
  - Route mount point

## Reusable UI Patterns

- MUI primitives: `AppBar`, `Toolbar`, `Typography`, `Button`, `IconButton`, `Box`
- Icons: `Brightness4`, `Brightness7`
- i18n-driven labels (no hard-coded UI copy in layout shell)
