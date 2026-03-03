import {
  OAUTH_PROVIDER_GOOGLE,
  OAUTH_PROVIDER_GITHUB,
  RFC_7807_TYPE_ABOUT_BLANK,
} from '@training-bmad-method-todolist/shared';

/**
 * Auth route prefix (after global /api prefix)
 */
export const AUTH_ROUTE_PREFIX = 'v1/auth';

/**
 * Auth endpoint paths
 */
export const AUTH_LOGIN_PATH = 'login/:provider';
export const AUTH_CALLBACK_PATH = 'callback/:provider';
export const AUTH_REFRESH_PATH = 'refresh';
export const AUTH_SIGN_OUT_PATH = 'sign-out';

/**
 * Cookie configuration
 */
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
export const OAUTH_STATE_COOKIE_PREFIX = 'oauth_state_';
export const AUTH_COOKIE_PATH = '/api/v1/auth';
export const COOKIE_SAME_SITE_LAX = 'lax' as const;

/**
 * OAuth state cookie max age (10 minutes in milliseconds)
 */
export const OAUTH_STATE_COOKIE_MAX_AGE_MS = 10 * 60 * 1000;

/**
 * Token expiry
 */
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * OAuth external URLs
 */
export const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GITHUB_AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
export const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';
export const GITHUB_USER_URL = 'https://api.github.com/user';
export const GITHUB_USER_EMAILS_URL = 'https://api.github.com/user/emails';

/**
 * OAuth scopes
 */
export const GOOGLE_OAUTH_SCOPES = 'openid profile email';
export const GITHUB_OAUTH_SCOPES = 'read:user user:email';

/**
 * PKCE
 */
export const PKCE_CHALLENGE_METHOD_S256 = 'S256';

/**
 * OAuth URL parameter names
 */
export const OAUTH_PARAM_CLIENT_ID = 'client_id';
export const OAUTH_PARAM_REDIRECT_URI = 'redirect_uri';
export const OAUTH_PARAM_RESPONSE_TYPE = 'response_type';
export const OAUTH_PARAM_SCOPE = 'scope';
export const OAUTH_PARAM_STATE = 'state';
export const OAUTH_PARAM_CODE_CHALLENGE_METHOD = 'code_challenge_method';
export const OAUTH_PARAM_CODE_CHALLENGE = 'code_challenge';
export const OAUTH_RESPONSE_TYPE_CODE = 'code';

/**
 * HTTP headers and content values
 */
export const AUTH_HEADER_BEARER_PREFIX = 'Bearer ';
export const CONTENT_TYPE_APPLICATION_JSON = 'application/json';
export const USER_AGENT_APP_NAME = 'training-bmad-method-todolist';

/**
 * RFC 7807 error messages for auth
 */
export const AUTH_ERROR_TITLE_UNAUTHORIZED = 'Unauthorized';
export const AUTH_ERROR_TITLE_INVALID_PROVIDER = 'Invalid OAuth provider';
export const AUTH_ERROR_TITLE_INVALID_CALLBACK = 'Invalid OAuth callback input';

export const AUTH_ERROR_DETAIL_STATE_MISSING = 'OAuth state cookie is missing.';
export const AUTH_ERROR_DETAIL_STATE_INVALID = 'Invalid OAuth state value.';
export const AUTH_ERROR_DETAIL_CODE_EXCHANGE_FAILED = 'OAuth authorization code exchange failed.';
export const AUTH_ERROR_DETAIL_NO_ACCESS_TOKEN = 'OAuth provider did not return an access token.';
export const AUTH_ERROR_DETAIL_PROFILE_FETCH_FAILED = 'Unable to retrieve OAuth user profile.';
export const AUTH_ERROR_DETAIL_USER_UPDATE_FAILED = 'Failed to update user record.';
export const AUTH_ERROR_DETAIL_USER_CREATE_FAILED = 'Failed to create user record.';
export const AUTH_ERROR_DETAIL_REFRESH_MISSING = 'Refresh token is missing.';
export const AUTH_ERROR_DETAIL_REFRESH_INVALID = 'Invalid or expired refresh token.';
export const AUTH_ERROR_DETAIL_USER_NOT_FOUND = 'User not found for refresh token.';
export const AUTH_ERROR_DETAIL_MISSING_CALLBACK_PARAMS = 'Missing OAuth callback query parameters.';
export const AUTH_ERROR_DETAIL_INVALID_PROVIDER = 'Provider must be google or github.';
export const AUTH_ERROR_DETAIL_MISSING_AUTH_HEADER = 'Missing or invalid Authorization header.';
export const AUTH_ERROR_DETAIL_INVALID_TOKEN = 'Invalid or expired access token.';

/**
 * GitHub email fallback log message
 */
export const GITHUB_EMAIL_FALLBACK_LOG =
  'Failed to fetch GitHub user emails — falling back to empty email.';
export const OAUTH_CODE_VALIDATION_FAILED_LOG = 'OAuth code validation failed';

/**
 * Auth status constants
 */
export const AUTH_HTTP_STATUS_UNAUTHORIZED = 401;
export const AUTH_HTTP_STATUS_BAD_REQUEST = 400;

/**
 * Re-export provider constants for convenience
 */
export { OAUTH_PROVIDER_GOOGLE, OAUTH_PROVIDER_GITHUB, RFC_7807_TYPE_ABOUT_BLANK };
