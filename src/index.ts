/**
 * Swapped Commerce SDK - Main Export
 * 
 * A performant, functional TypeScript SDK for the Swapped Commerce API.
 * Built with Bun-native patterns, pure functions, and strict typing.
 */

// Client factory
export { createClient } from './client/createClient'
export type { SwappedClient } from './client/createClient'

// Types
export * from './types'

// Error classes
export {
  SwappedError,
  SwappedAuthenticationError,
  SwappedValidationError,
  SwappedRateLimitError,
  SwappedNotFoundError,
  createAuthenticationError,
  createValidationError,
  createRateLimitError,
  createNotFoundError,
} from './utils/errors'

// Webhook utilities
export { verifyWebhookSignature, parseWebhookEvent } from './utils/webhooks'
