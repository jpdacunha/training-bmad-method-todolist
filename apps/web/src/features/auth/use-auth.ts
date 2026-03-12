import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/auth.store';
import { refreshAccessToken } from '../../api/api-client';
import {
  API_AUTH_LOGIN_PREFIX,
  API_AUTH_CALLBACK_PREFIX,
  API_AUTH_SIGN_OUT,
  FETCH_CREDENTIALS_INCLUDE,
  HTTP_HEADER_CONTENT_TYPE,
  HTTP_CONTENT_TYPE_JSON,
  HTTP_METHOD_POST,
  STORAGE_KEY_OAUTH_PROVIDER,
  QUERY_PARAM_CODE,
  QUERY_PARAM_STATE,
  OAUTH_PROVIDER_GOOGLE,
  OAUTH_PROVIDER_GITHUB,
  type OAuthProvider,
  ERROR_INVALID_OAUTH_PROVIDER,
} from '../../constants/auth.constants';
import { ROUTE_HOME, ROUTE_LOGIN } from '../../constants/app.constants';

export function useAuthBootstrap(): void {
  useEffect(() => {
    refreshAccessToken().then((refreshed) => {
      if (!refreshed) {
        useAuthStore.getState().clearAuth();
      }
    });
  }, []);
}

export function useLogin() {
  const startLogin = useCallback(async (provider: OAuthProvider) => {
    const response = await fetch(`${API_AUTH_LOGIN_PREFIX}${provider}`, {
      credentials: FETCH_CREDENTIALS_INCLUDE,
    });

    if (!response.ok) {
      throw await response.json();
    }

    const data: { redirectUrl: string } = await response.json();
    sessionStorage.setItem(STORAGE_KEY_OAUTH_PROVIDER, provider);
    window.location.href = data.redirectUrl;
  }, []);

  return { startLogin };
}

export function useOAuthCallback() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const handleCallback = useCallback(
    async (code: string, state: string) => {
      const provider = sessionStorage.getItem(STORAGE_KEY_OAUTH_PROVIDER);

      if (
        !provider ||
        (provider !== OAUTH_PROVIDER_GOOGLE && provider !== OAUTH_PROVIDER_GITHUB)
      ) {
        throw new Error(ERROR_INVALID_OAUTH_PROVIDER);
      }

      sessionStorage.removeItem(STORAGE_KEY_OAUTH_PROVIDER);

      const params = new URLSearchParams();
      params.set(QUERY_PARAM_CODE, code);
      params.set(QUERY_PARAM_STATE, state);

      const response = await fetch(
        `${API_AUTH_CALLBACK_PREFIX}${provider}?${params.toString()}`,
        { credentials: FETCH_CREDENTIALS_INCLUDE },
      );

      if (!response.ok) {
        throw await response.json();
      }

      const data: { accessToken: string } = await response.json();
      setAccessToken(data.accessToken);
      navigate(ROUTE_HOME, { replace: true });
    },
    [navigate, setAccessToken],
  );

  return { handleCallback };
}

export function useSignOut() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = useCallback(async () => {
    try {
      await fetch(API_AUTH_SIGN_OUT, {
        method: HTTP_METHOD_POST,
        credentials: FETCH_CREDENTIALS_INCLUDE,
        headers: { [HTTP_HEADER_CONTENT_TYPE]: HTTP_CONTENT_TYPE_JSON },
      });
    } finally {
      queryClient.clear();
      clearAuth();
      navigate(ROUTE_LOGIN, { replace: true });
    }
  }, [clearAuth, navigate, queryClient]);

  return { signOut };
}
