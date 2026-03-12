import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../../theme';
import { AppLayout } from '../../layouts/app-layout';
import { useAuthStore } from '../../stores/auth.store';
import { ROUTE_HOME, ROUTE_LOGIN } from '../../constants/app.constants';
import '../../i18n';

function renderAppLayout() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={[ROUTE_HOME]}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path={ROUTE_HOME} element={<div data-testid="content">Content</div>} />
            </Route>
            <Route path={ROUTE_LOGIN} element={<div data-testid="login-redirect">Login</div>} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('AppLayout sign-out', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'test-token',
      isAuthenticated: true,
      isBootstrapping: false,
    });
    vi.restoreAllMocks();
  });

  it('renders app title, language switcher, theme toggle, and sign-out button', () => {
    renderAppLayout();

    expect(screen.getByText(/TodoList/)).toBeDefined();
    expect(screen.getByText('FR')).toBeDefined();
    expect(screen.getByLabelText('Toggle theme')).toBeDefined();
    expect(screen.getByLabelText('Sign out')).toBeDefined();
  });

  it('calls sign-out endpoint and redirects to login', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );

    renderAppLayout();

    const signOutBtn = screen.getByLabelText('Sign out');
    fireEvent.click(signOutBtn);

    await waitFor(() => {
      expect(screen.getByTestId('login-redirect')).toBeDefined();
    });

    expect(mockFetch).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
