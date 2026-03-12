import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../stores/auth.store';
import { refreshAccessToken, apiClient } from './api-client';
import {
  HTTP_STATUS_UNAUTHORIZED,
  ERROR_SESSION_EXPIRED,
} from '../constants/auth.constants';

describe('apiClient', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'test-token',
      isAuthenticated: true,
      isBootstrapping: false,
    });
    vi.restoreAllMocks();
  });

  it('adds Authorization header with bearer token', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: 'ok' }), { status: 200 }),
    );

    await apiClient('/api/v1/test');

    expect(mockFetch).toHaveBeenCalledOnce();
    const request = mockFetch.mock.calls[0]!;
    const headers = request[1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('attempts refresh on 401 then retries', async () => {
    const mockFetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Unauthorized' }), { status: HTTP_STATUS_UNAUTHORIZED }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: 'new-token' }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: 'success' }), { status: 200 }),
      );

    const result = await apiClient<{ data: string }>('/api/v1/protected');

    expect(result).toEqual({ data: 'success' });
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(useAuthStore.getState().accessToken).toBe('new-token');
  });

  it('redirects to /login when refresh fails on 401', async () => {
    const hrefSetter = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { href: '/' },
      writable: true,
    });
    Object.defineProperty(window.location, 'href', {
      set: hrefSetter,
      get: () => '/',
    });

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Unauthorized' }), { status: HTTP_STATUS_UNAUTHORIZED }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Refresh failed' }), { status: HTTP_STATUS_UNAUTHORIZED }),
      );

    await expect(apiClient('/api/v1/protected')).rejects.toThrow(ERROR_SESSION_EXPIRED);

    expect(hrefSetter).toHaveBeenCalledWith('/login');

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

describe('refreshAccessToken', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
      isBootstrapping: false,
    });
    vi.restoreAllMocks();
  });

  it('returns true and updates token on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ accessToken: 'refreshed-token' }), { status: 200 }),
    );

    const result = await refreshAccessToken();

    expect(result).toBe(true);
    expect(useAuthStore.getState().accessToken).toBe('refreshed-token');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('returns false on failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Invalid' }), { status: 401 }),
    );

    const result = await refreshAccessToken();

    expect(result).toBe(false);
  });

  it('deduplicates concurrent refreshes', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ accessToken: 'deduped-token' }), { status: 200 }),
    );

    const [r1, r2, r3] = await Promise.all([
      refreshAccessToken(),
      refreshAccessToken(),
      refreshAccessToken(),
    ]);

    expect(r1).toBe(true);
    expect(r2).toBe(true);
    expect(r3).toBe(true);
    // Only one fetch should happen due to dedup
    expect(mockFetch).toHaveBeenCalledOnce();
  });
});
