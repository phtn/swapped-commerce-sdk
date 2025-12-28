/**
 * Base error class for Swapped Commerce SDK
 */
export class SwappedError extends Error {
  public readonly statusCode?: number
  public readonly code?: string
  public readonly details?: Readonly<Record<string, unknown>>

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: Readonly<Record<string, unknown>>
  ) {
    super(message)
    this.name = 'SwappedError'
    this.statusCode = statusCode
    this.code = code
    this.details = details

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SwappedError)
    }
  }
}

/**
 * Authentication error (401)
 */
export class SwappedAuthenticationError extends SwappedError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'SwappedAuthenticationError'
  }
}

/**
 * Validation error (400)
 */
export class SwappedValidationError extends SwappedError {
  constructor(
    message: string,
    details?: Readonly<Record<string, unknown>>
  ) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'SwappedValidationError'
  }
}

/**
 * Rate limit error (429)
 */
export class SwappedRateLimitError extends SwappedError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR')
    this.name = 'SwappedRateLimitError'
  }
}

/**
 * Not found error (404)
 */
export class SwappedNotFoundError extends SwappedError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR')
    this.name = 'SwappedNotFoundError'
  }
}

/**
 * Factory function for authentication errors
 */
export function createAuthenticationError(
  message?: string
): SwappedAuthenticationError {
  return new SwappedAuthenticationError(message)
}

/**
 * Factory function for validation errors
 */
export function createValidationError(
  message: string,
  details?: Readonly<Record<string, unknown>>
): SwappedValidationError {
  return new SwappedValidationError(message, details)
}

/**
 * Factory function for rate limit errors
 */
export function createRateLimitError(
  message?: string
): SwappedRateLimitError {
  return new SwappedRateLimitError(message)
}

/**
 * Factory function for not found errors
 */
export function createNotFoundError(resource: string): SwappedNotFoundError {
  return new SwappedNotFoundError(resource)
}
