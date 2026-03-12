export const OAUTH_PROVIDER_GOOGLE = 'google';
export const OAUTH_PROVIDER_GITHUB = 'github';
export type OAuthProvider =
  | typeof OAUTH_PROVIDER_GOOGLE
  | typeof OAUTH_PROVIDER_GITHUB;

/**
 * Auth route paths
 */
export const ROUTE_AUTH_CALLBACK = '/auth/callback';

/**
 * Auth API endpoints
 */
export const API_AUTH_LOGIN_PREFIX = '/api/v1/auth/login/';
export const API_AUTH_CALLBACK_PREFIX = '/api/v1/auth/callback/';
export const API_AUTH_REFRESH = '/api/v1/auth/refresh';
export const API_AUTH_SIGN_OUT = '/api/v1/auth/sign-out';

/**
 * Session storage keys
 */
export const STORAGE_KEY_OAUTH_PROVIDER = 'oauth_provider';

/**
 * HTTP constants
 */
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_HEADER_AUTHORIZATION = 'Authorization';
export const HTTP_HEADER_CONTENT_TYPE = 'Content-Type';
export const HTTP_CONTENT_TYPE_JSON = 'application/json';
export const HTTP_AUTH_BEARER_PREFIX = 'Bearer ';
export const HTTP_METHOD_POST = 'POST' as const;
export const FETCH_CREDENTIALS_INCLUDE = 'include' as const;

/**
 * URL query parameter names
 */
export const QUERY_PARAM_CODE = 'code';
export const QUERY_PARAM_STATE = 'state';

/**
 * Internal error identifiers
 */
export const ERROR_INVALID_OAUTH_PROVIDER = 'Invalid or missing OAuth provider in session';
export const ERROR_SESSION_EXPIRED = 'Session expired';

/**
 * RFC 7807 fields
 */
export const RFC7807_FIELD_STATUS = 'status';

/**
 * Auth callback i18n keys
 */
export const I18N_KEY_AUTH_ERROR_LOGIN_FAILED = 'auth.errorLoginFailed';
export const I18N_KEY_AUTH_ERROR_MISSING_CALLBACK_PARAMS = 'auth.errorMissingCallbackParams';
export const I18N_KEY_AUTH_ERROR_CALLBACK_FAILED = 'auth.errorCallbackFailed';
export const I18N_KEY_AUTH_ERROR_CALLBACK_UNAUTHORIZED = 'auth.errorCallbackUnauthorized';
export const I18N_KEY_AUTH_BACK_TO_LOGIN = 'auth.backToLogin';
export const I18N_KEY_AUTH_CALLBACK_PROCESSING = 'auth.callbackProcessing';
