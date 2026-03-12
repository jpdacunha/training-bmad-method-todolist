import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../../theme';
import { AuthCallback } from './auth-callback';
import { useAuthStore } from '../../stores/auth.store';
import { ROUTE_AUTH_CALLBACK } from '../../constants/auth.constants';
import { ROUTE_HOME } from '../../constants/app.constants';
import '../../i18n';

function renderCallback(search: string = '?code=test-code&state=test-state') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={[`${ROUTE_AUTH_CALLBACK}${search}`]}>
          <Routes>
            <Route path={ROUTE_AUTH_CALLBACK} element={<AuthCallback />} />
            <Route path={ROUTE_HOME} element={<div data-testid="dashboard">Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('AuthCallback', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
      isBootstrapping: false,
    });
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('shows error when code or state is missing', async () => {
    renderCallback('');

    await waitFor(() => {
      expect(
        screen.getByText('Invalid authentication response. Please try signing in again.'),
      ).toBeDefined();
    });
  });

  it('shows processing indicator when code and state are present', () => {
    sessionStorage.setItem('oauth_provider', 'google');

    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise<Response>(() => {}));

    renderCallback();

    expect(screen.getByText('Completing sign-in...')).toBeDefined();
  });

  it('shows error when callback fails', async () => {
    sessionStorage.setItem('oauth_provider', 'google');

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ type: 'about:blank', title: 'Unauthorized', status: 401, detail: 'Failed' }),
        { status: 401 },
      ),
    );

    renderCallback();

    await waitFor(() => {
      expect(
        screen.getByText('Your session could not be established. Please sign in again.'),
      ).toBeDefined();
    });
  });

  it('navigates to home on successful callback', async () => {
    sessionStorage.setItem('oauth_provider', 'google');

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ accessToken: 'valid-token' }), { status: 200 }),
    );

    renderCallback();

    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeDefined();
    });
  });
});
