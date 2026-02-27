# Data Models — Web Part

## Client-Side State Models

### UI Store (`ui.store.ts`)

- `themeMode`: `light | dark`
- `sidebarOpen`: boolean
- Actions: `toggleTheme`, `setSidebarOpen`
- Persistence key: `ui-store`

### Language Store (`language.store.ts`)

- `language`: `en | fr`
- Action: `setLanguage`
- Persistence key: `language-store`

## Shared Typed Contracts Used by Web

- `TaskStatus` enum for task lifecycle vocabulary
- `taskSchema` and `createTaskSchema` for validation-ready feature work
- `ApiResponse<T>` and `ApiError` for API envelope consistency

## Notes

- No local database layer is defined; data persistence is expected via backend APIs.
