/**
 * Standard API response envelope — used by all API endpoints
 * [Source: architecture.md#API & Communication Patterns]
 */
export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
  errors?: ApiError[];
}

/**
 * RFC 7807 Problem Details error format
 * [Source: architecture.md#Error Handling Patterns]
 */
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}
