import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../../theme';
import { AuthGuard } from './auth-guard';
import { useAuthStore } from '../../stores/auth.store';
import { ROUTE_LOGIN, ROUTE_HOME } from '../../constants/app.constants';
import '../../i18n';

function renderWithProviders(initialPath: string = ROUTE_HOME) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route element={<AuthGuard />}>
              <Route path={ROUTE_HOME} element={<div data-testid="protected-content">Protected</div>} />
            </Route>
            <Route path={ROUTE_LOGIN} element={<div data-testid="login-page">Login</div>} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('AuthGuard', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
      isBootstrapping: false,
    });
  });

  it('redirects unauthenticated users to /login', () => {
    renderWithProviders();

    expect(screen.getByTestId('login-page')).toBeDefined();
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('renders protected content for authenticated users', () => {
    useAuthStore.setState({
      accessToken: 'test-token',
      isAuthenticated: true,
      isBootstrapping: false,
    });

    renderWithProviders();

    expect(screen.getByTestId('protected-content')).toBeDefined();
    expect(screen.queryByTestId('login-page')).toBeNull();
  });

  it('shows skeleton loading while bootstrapping', () => {
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
      isBootstrapping: true,
    });

    renderWithProviders();

    expect(screen.queryByTestId('protected-content')).toBeNull();
    expect(screen.queryByTestId('login-page')).toBeNull();
  });
});
