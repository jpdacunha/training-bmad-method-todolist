import { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import { lightTheme, darkTheme } from './theme';
import { useUiStore } from './stores/ui.store';
import { AppRoutes } from './routes';
import './i18n';
import { THEME_MODE_DARK, QUERY_STALE_TIME_MS, QUERY_RETRY_COUNT } from './constants/app.constants';
import { handleGlobalUnauthorizedError } from './api/api-client';

/**
 * Root application component — wires all providers
 * [Source: architecture.md#Frontend Architecture — State Management]
 *
 * Provider order:
 * 1. QueryClientProvider (TanStack Query — server state)
 * 2. ThemeProvider (MUI — theming)
 * 3. CssBaseline (MUI — global resets)
 * 4. AppRoutes (React Router — routing)
 *
 * i18n is initialized by side-effect import of ./i18n.ts
 * Zustand stores are consumed directly in components (no provider needed)
 */

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      void handleGlobalUnauthorizedError(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      void handleGlobalUnauthorizedError(error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      retry: QUERY_RETRY_COUNT,
    },
  },
});

export function App() {
  const themeMode = useUiStore((state) => state.themeMode);
  const theme = useMemo(
    () => (themeMode === THEME_MODE_DARK ? darkTheme : lightTheme),
    [themeMode],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
