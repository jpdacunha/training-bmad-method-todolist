import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from './app';
import { useAuthStore } from './stores/auth.store';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing and shows login when unauthenticated', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Sign in to your workspace/i)).toBeDefined();
    });
  });

  it('renders app title when authenticated', async () => {
    useAuthStore.setState({
      accessToken: 'test-token',
      isAuthenticated: true,
      isBootstrapping: false,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/TodoList/i)).toBeDefined();
    });
  });
});
