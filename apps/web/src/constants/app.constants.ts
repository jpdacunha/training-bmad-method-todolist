/**
 * Web application constants
 */

/**
 * DOM
 */
export const ROOT_ELEMENT_ID = 'root';
export const ROOT_ELEMENT_NOT_FOUND_ERROR = 'Root element not found';

/**
 * Route paths
 */
export const ROUTE_HOME = '/';
export const ROUTE_LOGIN = '/login';

/**
 * i18n / Language
 */
export const LANGUAGE_EN = 'en';
export const LANGUAGE_FR = 'fr';
export const LANGUAGE_DETECTION_PREFIX_FR = 'fr';
export const I18N_FALLBACK_LANGUAGE = LANGUAGE_EN;

/**
 * Theme
 */
export const THEME_MODE_LIGHT = 'light' as const;
export const THEME_MODE_DARK = 'dark' as const;

/**
 * localStorage persistence keys
 */
export const STORE_KEY_UI = 'ui-store';
export const STORE_KEY_LANGUAGE = 'language-store';

/**
 * Query client config
 */
export const QUERY_STALE_TIME_MS = 1000 * 60;
export const QUERY_RETRY_COUNT = 1;
