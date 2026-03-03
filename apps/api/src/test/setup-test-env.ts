/**
 * Sets required environment variables for integration tests that bootstrap AppModule.
 * Centralised here so every test doesn't duplicate the full env list.
 * Values use nullish coalescing to avoid overwriting real CI env vars.
 */
export function setupTestEnv(): void {
  process.env['DATABASE_URL'] =
    process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/todolist';
  process.env['JWT_SECRET'] = process.env['JWT_SECRET'] ?? 'test-jwt-secret';
  process.env['GOOGLE_CLIENT_ID'] = process.env['GOOGLE_CLIENT_ID'] ?? 'test-google-client-id';
  process.env['GOOGLE_CLIENT_SECRET'] =
    process.env['GOOGLE_CLIENT_SECRET'] ?? 'test-google-client-secret';
  process.env['GOOGLE_REDIRECT_URI'] =
    process.env['GOOGLE_REDIRECT_URI'] ?? 'http://localhost:3000/api/v1/auth/callback/google';
  process.env['GITHUB_CLIENT_ID'] = process.env['GITHUB_CLIENT_ID'] ?? 'test-github-client-id';
  process.env['GITHUB_CLIENT_SECRET'] =
    process.env['GITHUB_CLIENT_SECRET'] ?? 'test-github-client-secret';
  process.env['GITHUB_REDIRECT_URI'] =
    process.env['GITHUB_REDIRECT_URI'] ?? 'http://localhost:3000/api/v1/auth/callback/github';
  process.env['PORT'] = process.env['PORT'] ?? '3000';
  process.env['PUBLIC_BASE_URL'] = process.env['PUBLIC_BASE_URL'] ?? 'http://localhost:3000';
}
