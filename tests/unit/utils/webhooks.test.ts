import { test, expect } from 'bun:test'
import { verifyWebhookSignature, parseWebhookEvent } from '../../../src/utils/webhooks'
import type { WebhookEvent } from '../../../src/types/webhooks'

test('verifyWebhookSignature validates correct signature', async () => {
  const payload = '{"event_type":"ORDER_CREATED","order_id":"123"}'
  const secret = 'test-secret-key'

  // Generate expected signature using Web Crypto
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const signatureArray = Array.from(new Uint8Array(signatureBuffer))
  const expectedSignature = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  const isValid = await verifyWebhookSignature(payload, expectedSignature, secret)
  expect(isValid).toBe(true)
})

test('verifyWebhookSignature rejects incorrect signature', async () => {
  const payload = '{"event_type":"ORDER_CREATED","order_id":"123"}'
  const secret = 'test-secret-key'
  const wrongSignature = 'invalid-signature'

  const isValid = await verifyWebhookSignature(payload, wrongSignature, secret)
  expect(isValid).toBe(false)
})

test('verifyWebhookSignature rejects signature with wrong secret', async () => {
  const payload = '{"event_type":"ORDER_CREATED","order_id":"123"}'
  const correctSecret = 'test-secret-key'
  const wrongSecret = 'wrong-secret-key'

  // Generate signature with correct secret
  const encoder = new TextEncoder()
  const keyData = encoder.encode(correctSecret)
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const signatureArray = Array.from(new Uint8Array(signatureBuffer))
  const signature = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  // Verify with wrong secret
  const isValid = await verifyWebhookSignature(payload, signature, wrongSecret)
  expect(isValid).toBe(false)
})

test('parseWebhookEvent parses valid JSON', () => {
  const payload = JSON.stringify({
    event_type: 'ORDER_CREATED',
    order_id: 'order_123',
    order_status: 'AWAITING_PAYMENT',
    merchant_id: 'merchant_456',
    order_purchase_amount: 99.99,
    order_purchase_currency: 'USD',
  })

  const event = parseWebhookEvent(payload)

  expect(event.event_type).toBe('ORDER_CREATED')
  expect(event.order_id).toBe('order_123')
  expect(event.order_status).toBe('AWAITING_PAYMENT')
})

test('parseWebhookEvent throws on invalid JSON', () => {
  const invalidPayload = '{ invalid json }'

  expect(() => {
    parseWebhookEvent(invalidPayload)
  }).toThrow()
})

test('parseWebhookEvent handles complete webhook event', () => {
  const payload: WebhookEvent = {
    event_type: 'PAYMENT_RECEIVED',
    order_id: 'order_123',
    order_status: 'PAYMENT_CONFIRMED_ACCURATE',
    merchant_id: 'merchant_456',
    order_purchase_amount: 99.99,
    order_purchase_currency: 'USD',
    order_crypto: 'BTC',
    order_crypto_amount: 0.001,
    network: 'bitcoin',
  }

  const parsed = parseWebhookEvent(JSON.stringify(payload))

  expect(parsed.event_type).toBe('PAYMENT_RECEIVED')
  expect(parsed.order_crypto).toBe('BTC')
  expect(parsed.order_crypto_amount).toBe(0.001)
  expect(parsed.network).toBe('bitcoin')
})
