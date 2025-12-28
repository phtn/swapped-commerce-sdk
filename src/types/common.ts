/**
 * Core configuration types
 */
export interface SwappedConfig {
  readonly apiKey: string
  readonly environment?: 'sandbox' | 'production'
  readonly timeout?: number
  readonly retries?: number
}

export type RequiredSwappedConfig = Required<SwappedConfig>

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  readonly data: T
  readonly message: string
  readonly success: boolean
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  readonly page?: number
  readonly limit?: number
}

/**
 * Pagination response
 */
export interface PaginationResponse {
  readonly currentPage: number
  readonly totalPages: number
  readonly totalItems: number
  readonly itemsPerPage: number
}

/**
 * HTTP configuration for resource functions
 */
export interface HttpConfig {
  readonly config: RequiredSwappedConfig
  readonly baseUrl: string
}
