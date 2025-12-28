import { test, expect } from 'bun:test'
import {
  SwappedError,
  SwappedAuthenticationError,
  SwappedValidationError,
  SwappedRateLimitError,
  SwappedNotFoundError,
  createAuthenticationError,
  createValidationError,
  createRateLimitError,
  createNotFoundError,
} from '../../../src/utils/errors'

test('SwappedError creates error with all properties', () => {
  const error = new SwappedError('Test error', 400, 'TEST_ERROR', { field: 'value' })

  expect(error.message).toBe('Test error')
  expect(error.statusCode).toBe(400)
  expect(error.code).toBe('TEST_ERROR')
  expect(error.details).toEqual({ field: 'value' })
  expect(error.name).toBe('SwappedError')
  expect(error).toBeInstanceOf(Error)
})

test('SwappedAuthenticationError has correct defaults', () => {
  const error = new SwappedAuthenticationError()

  expect(error.message).toBe('Authentication failed')
  expect(error.statusCode).toBe(401)
  expect(error.code).toBe('AUTHENTICATION_ERROR')
  expect(error.name).toBe('SwappedAuthenticationError')
})

test('SwappedValidationError includes details', () => {
  const details = { field: 'email', reason: 'invalid format' }
  const error = new SwappedValidationError('Validation failed', details)

  expect(error.message).toBe('Validation failed')
  expect(error.statusCode).toBe(400)
  expect(error.code).toBe('VALIDATION_ERROR')
  expect(error.details).toEqual(details)
})

test('SwappedRateLimitError has correct defaults', () => {
  const error = new SwappedRateLimitError()

  expect(error.message).toBe('Rate limit exceeded')
  expect(error.statusCode).toBe(429)
  expect(error.code).toBe('RATE_LIMIT_ERROR')
})

test('SwappedNotFoundError formats message correctly', () => {
  const error = new SwappedNotFoundError('Order')

  expect(error.message).toBe('Order not found')
  expect(error.statusCode).toBe(404)
  expect(error.code).toBe('NOT_FOUND_ERROR')
})

test('Factory functions create correct error types', () => {
  const authError = createAuthenticationError('Custom message')
  expect(authError).toBeInstanceOf(SwappedAuthenticationError)
  expect(authError.message).toBe('Custom message')

  const validationError = createValidationError('Invalid', { field: 'test' })
  expect(validationError).toBeInstanceOf(SwappedValidationError)
  expect(validationError.details).toEqual({ field: 'test' })

  const rateLimitError = createRateLimitError('Too many requests')
  expect(rateLimitError).toBeInstanceOf(SwappedRateLimitError)
  expect(rateLimitError.message).toBe('Too many requests')

  const notFoundError = createNotFoundError('Resource')
  expect(notFoundError).toBeInstanceOf(SwappedNotFoundError)
  expect(notFoundError.message).toBe('Resource not found')
})
