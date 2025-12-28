import { test, expect } from 'bun:test'
import { withRetry } from '../../../src/utils/retry'
import { SwappedError, SwappedValidationError } from '../../../src/utils/errors'

test('withRetry succeeds on first attempt', async () => {
  let attempts = 0
  const fn = async () => {
    attempts++
    return 'success'
  }

  const result = await withRetry(fn, { maxRetries: 3, timeout: 1000 })

  expect(result).toBe('success')
  expect(attempts).toBe(1)
})

test('withRetry retries on failure', async () => {
  let attempts = 0
  const fn = async () => {
    attempts++
    if (attempts < 3) {
      throw new Error('Temporary failure')
    }
    return 'success'
  }

  const result = await withRetry(fn, { maxRetries: 3, timeout: 1000 })

  expect(result).toBe('success')
  expect(attempts).toBe(3)
})

test('withRetry throws after max retries', async () => {
  const fn = async () => {
    throw new Error('Persistent failure')
  }

  await expect(
    withRetry(fn, { maxRetries: 2, timeout: 1000 })
  ).rejects.toThrow('Persistent failure')
})

test('withRetry does not retry on 4xx errors except 429', async () => {
  let attempts = 0
  const fn = async () => {
    attempts++
    throw new SwappedValidationError('Bad request')
  }

  await expect(
    withRetry(fn, { maxRetries: 3, timeout: 1000 })
  ).rejects.toThrow(SwappedValidationError)

  expect(attempts).toBe(1) // Should not retry
})

test('withRetry retries on 429 rate limit errors', async () => {
  let attempts = 0
  const fn = async () => {
    attempts++
    if (attempts < 2) {
      throw new SwappedError('Rate limited', 429, 'RATE_LIMIT_ERROR')
    }
    return 'success'
  }

  const result = await withRetry(fn, { maxRetries: 3, timeout: 1000 })

  expect(result).toBe('success')
  expect(attempts).toBe(2)
})

test('withRetry uses exponential backoff', async () => {
  const startTime = Date.now()
  let attempts = 0

  const fn = async () => {
    attempts++
    if (attempts < 2) {
      throw new Error('Retry')
    }
    return 'success'
  }

  await withRetry(fn, { maxRetries: 3, timeout: 1000 })

  const elapsed = Date.now() - startTime
  // Should have waited at least 1 second (2^0 * 1000ms) for first retry
  expect(elapsed).toBeGreaterThanOrEqual(1000)
})
