import type {
  RequiredSwappedConfig,
  ApiResponse,
} from '../types/common'
import {
  SwappedError,
  SwappedAuthenticationError,
  SwappedValidationError,
  SwappedRateLimitError,
  SwappedNotFoundError,
} from './errors'
import { withRetry } from './retry'

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * Base URL for Swapped Commerce API
 */
const BASE_URL = 'https://pay-api.swapped.com'

/**
 * Pure function for building URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  path: string,
  params?: Readonly<Record<string, unknown>>
): string {
  const url = new URL(path, baseUrl)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    }
  }

  return url.toString()
}

/**
 * Pure function for creating request configuration
 */
export function createRequestConfig(
  config: RequiredSwappedConfig,
  method: HttpMethod,
  path: string,
  body?: unknown
): RequestInit {
  const headers: Record<string, string> = {
    'X-API-Key': config.apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  const requestInit: RequestInit = {
    method,
    headers,
  }

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body)
  }

  return requestInit
}

/**
 * Pure function for handling error responses
 */
async function handleErrorResponse(
  response: Response
): Promise<SwappedError> {
  let errorData: {
    message?: string
    code?: string
    details?: Readonly<Record<string, unknown>>
  } = {}

  try {
    const text = await response.text()
    if (text) {
      errorData = JSON.parse(text) as typeof errorData
    }
  } catch {
    // If parsing fails, use empty object
  }

  const message = errorData.message ?? response.statusText

  switch (response.status) {
    case 401:
      return new SwappedAuthenticationError(message)
    case 400:
      return new SwappedValidationError(message, errorData.details)
    case 404:
      return new SwappedNotFoundError(message)
    case 429:
      return new SwappedRateLimitError(message)
    default:
      return new SwappedError(
        message,
        response.status,
        errorData.code,
        errorData.details
      )
  }
}

/**
 * Pure function for making HTTP requests with retry logic
 */
export async function request<T>(
  config: RequiredSwappedConfig,
  method: HttpMethod,
  path: string,
  options?: {
    readonly body?: unknown
    readonly params?: Readonly<Record<string, unknown>>
  }
): Promise<ApiResponse<T>> {
  const url = buildUrl(BASE_URL, path, options?.params)
  const requestConfig = createRequestConfig(config, method, path, options?.body)

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, config.timeout)

  try {
    const response = await withRetry(
      async () => {
        const res = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        })

        if (!res.ok) {
          throw await handleErrorResponse(res)
        }

        return res
      },
      {
        maxRetries: config.retries,
        timeout: config.timeout,
      }
    )

    const data = (await response.json()) as ApiResponse<T>
    return data
  } catch (error) {
    if (error instanceof SwappedError) {
      throw error
    }

    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new SwappedError(
        `Request timeout after ${config.timeout}ms`,
        408,
        'TIMEOUT_ERROR'
      )
    }

    // Handle network errors
    throw new SwappedError(
      error instanceof Error ? error.message : 'Network error occurred',
      0,
      'NETWORK_ERROR'
    )
  } finally {
    clearTimeout(timeoutId)
  }
}
