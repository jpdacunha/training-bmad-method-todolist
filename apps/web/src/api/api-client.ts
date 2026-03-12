import { useAuthStore } from '../stores/auth.store';
import {
  API_AUTH_REFRESH,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_HEADER_AUTHORIZATION,
  HTTP_HEADER_CONTENT_TYPE,
  HTTP_CONTENT_TYPE_JSON,
  HTTP_AUTH_BEARER_PREFIX,
  HTTP_METHOD_POST,
  FETCH_CREDENTIALS_INCLUDE,
  RFC7807_FIELD_STATUS,
  ERROR_SESSION_EXPIRED,
} from '../constants/auth.constants';
import { ROUTE_LOGIN } from '../constants/app.constants';

let refreshPromise: Promise<boolean> | null = null;
let isRedirectingToLogin = false;

type ErrorWithStatus = {
  [RFC7807_FIELD_STATUS]?: unknown;
};

function isUnauthorizedError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as ErrorWithStatus;
  return candidate[RFC7807_FIELD_STATUS] === HTTP_STATUS_UNAUTHORIZED;
}

function redirectToLogin(): void {
  useAuthStore.getState().clearAuth();

  if (!isRedirectingToLogin) {
    isRedirectingToLogin = true;
    window.location.href = ROUTE_LOGIN;
  }
}

export async function handleGlobalUnauthorizedError(error: unknown): Promise<void> {
  if (!isUnauthorizedError(error)) {
    return;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    redirectToLogin();
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(API_AUTH_REFRESH, {
        method: HTTP_METHOD_POST,
        credentials: FETCH_CREDENTIALS_INCLUDE,
        headers: { [HTTP_HEADER_CONTENT_TYPE]: HTTP_CONTENT_TYPE_JSON },
      });

      if (!response.ok) {
        return false;
      }

      const data: { accessToken: string } = await response.json();
      useAuthStore.getState().setAccessToken(data.accessToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiClient<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const headers = new Headers(options.headers);

  if (token) {
    headers.set(HTTP_HEADER_AUTHORIZATION, `${HTTP_AUTH_BEARER_PREFIX}${token}`);
  }
  if (!headers.has(HTTP_HEADER_CONTENT_TYPE)) {
    headers.set(HTTP_HEADER_CONTENT_TYPE, HTTP_CONTENT_TYPE_JSON);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: FETCH_CREDENTIALS_INCLUDE,
  });

  if (response.status === HTTP_STATUS_UNAUTHORIZED) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      const newToken = useAuthStore.getState().accessToken;
      const retryHeaders = new Headers(options.headers);
      if (newToken) {
        retryHeaders.set(
          HTTP_HEADER_AUTHORIZATION,
          `${HTTP_AUTH_BEARER_PREFIX}${newToken}`,
        );
      }
      if (!retryHeaders.has(HTTP_HEADER_CONTENT_TYPE)) {
        retryHeaders.set(HTTP_HEADER_CONTENT_TYPE, HTTP_CONTENT_TYPE_JSON);
      }

      const retryResponse = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: FETCH_CREDENTIALS_INCLUDE,
      });

      if (!retryResponse.ok) {
        throw await retryResponse.json();
      }

      return retryResponse.json();
    }

    redirectToLogin();
    throw new Error(ERROR_SESSION_EXPIRED);
  }

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
}
