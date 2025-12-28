import { SwappedError } from './errors'

/**
 * Retry configuration
 */
export interface RetryConfig {
  readonly maxRetries: number
  readonly timeout: number
}

/**
 * Pure function for retrying with exponential backoff
 * 
 * @param fn - Function to retry
 * @param config - Retry configuration
 * @returns Promise that resolves with the function result or rejects after all retries
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (
        error instanceof SwappedError &&
        error.statusCode !== undefined &&
        error.statusCode >= 400 &&
        error.statusCode < 500 &&
        error.statusCode !== 429
      ) {
        throw error
      }

      // Wait before retry (exponential backoff)
      if (attempt < config.maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000
        await delay(delayMs)
      }
    }
  }

  throw lastError ?? new Error('Request failed after retries')
}

/**
 * Delay helper function
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
