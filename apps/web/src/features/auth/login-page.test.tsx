import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../../theme';
import { LoginPage } from './login-page';
import { useAuthStore } from '../../stores/auth.store';
import '../../i18n';
import i18n from '../../i18n';

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
      isBootstrapping: false,
    });
    i18n.changeLanguage('en');
  });

  it('renders login title and two provider buttons', () => {
    renderLoginPage();

    expect(screen.getByText('Sign in to your workspace')).toBeDefined();
    expect(screen.getByText('Sign in with Google')).toBeDefined();
    expect(screen.getByText('Sign in with GitHub')).toBeDefined();
  });

  it('renders i18n keys in French', async () => {
    await i18n.changeLanguage('fr');
    renderLoginPage();

    expect(screen.getByText('Connectez-vous à votre espace de travail')).toBeDefined();
    expect(screen.getByText('Se connecter avec Google')).toBeDefined();
    expect(screen.getByText('Se connecter avec GitHub')).toBeDefined();
  });

  it('shows skeleton while bootstrapping', () => {
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
      isBootstrapping: true,
    });

    renderLoginPage();

    expect(screen.queryByText('Sign in to your workspace')).toBeNull();
  });
});
