# Architecture — Web (`web` part)

## Executive Summary

The web part is a React + Vite SPA. It uses MUI for UI foundation, Zustand for client state, TanStack Query for server state, and i18next for localization.

## Technology Stack

- React 19 + React DOM
- Vite 7 + `@vitejs/plugin-react`
- MUI 7 + Emotion
- React Router 7
- Zustand 5 (`persist` middleware)
- TanStack React Query 5
- i18next + react-i18next

## Architecture Pattern

- **Pattern:** Provider-centric component architecture with route layout shell.
- Root provider order in `app.tsx`:
  1. `QueryClientProvider`
  2. `ThemeProvider`
  3. `CssBaseline`
  4. `AppRoutes`

## Component Structure

- Layout shell: `layouts/app-layout.tsx`
- Route declaration: `routes.tsx`
- Persistent stores: `stores/ui.store.ts`, `stores/language.store.ts`
- Localization resources: `locales/en.json`, `locales/fr.json`

## State and Data Flow

- UI preference state (theme/sidebar) is managed via Zustand (`ui-store`).
- Language preference is managed via Zustand (`language-store`) and synchronized with i18next.
- Server-state caching strategy is initialized through a shared `QueryClient`.

## Integration with API

- Development proxy forwards `/api` traffic to `http://localhost:3000`.
- Route placeholders indicate feature development is planned for future stories.
