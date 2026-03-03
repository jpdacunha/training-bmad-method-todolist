/**
 * Application-level constants for the API
 */
export const API_GLOBAL_PREFIX = 'api';
export const API_DOCS_PATH = 'api/docs';
export const BOOTSTRAP_LOGGER_CONTEXT = 'Bootstrap';

/**
 * Swagger / OpenAPI metadata
 */
export const SWAGGER_TITLE = 'Training BMad Method TodoList API';
export const SWAGGER_DESCRIPTION =
  'Daily execution cockpit for busy freelancers — intelligent task prioritization';
export const SWAGGER_VERSION = '0.0.1';

/**
 * Environment
 */
export const NODE_ENV_PRODUCTION = 'production';
export const NODE_ENV_KEY = 'NODE_ENV';
export const ENV_LOG_PREFIX = '[Env]';

/**
 * Database
 */
export const DATABASE_LOGGER_CONTEXT = 'DatabaseProvider';
export const DATABASE_INIT_MESSAGE = 'Drizzle database client initialized.';
export const DATABASE_CONNECTIVITY_QUERY = 'SELECT 1';
export const DATABASE_CONNECTIVITY_SUCCESS_MESSAGE =
  'PostgreSQL connectivity check passed via initialized pool.';
export const DATABASE_CONNECTIVITY_FAILURE_PREFIX = 'PostgreSQL connectivity check failed: ';
