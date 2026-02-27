import { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme, darkTheme } from './theme';
import { useUiStore } from './stores/ui.store';
import { AppRoutes } from './routes';
import './i18n';

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
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

export function App() {
  const themeMode = useUiStore((state) => state.themeMode);
  const theme = useMemo(() => (themeMode === 'dark' ? darkTheme : lightTheme), [themeMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
