import { test, expect } from 'bun:test'
import { buildUrl, createRequestConfig } from '../src/utils/http'
import { verifyWebhookSignature } from '../src/utils/webhooks'
import type { RequiredSwappedConfig } from '../src/types/common'

/**
 * Performance benchmarks for Swapped Commerce SDK
 */

const config: RequiredSwappedConfig = {
  apiKey: 'test-key',
  environment: 'production',
  timeout: 30000,
  retries: 3,
}

test('URL building performance', () => {
  const iterations = 10000
  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    buildUrl('https://api.example.com', '/v1/test', {
      page: i,
      limit: 10,
      search: `query-${i}`,
    })
  }

  const end = performance.now()
  const duration = end - start
  const opsPerSecond = (iterations / duration) * 1000

  console.log(`URL Building: ${opsPerSecond.toFixed(0)} ops/sec`)
  expect(opsPerSecond).toBeGreaterThan(10000) // Should handle at least 10k ops/sec
})

test('Request config creation performance', () => {
  const iterations = 10000
  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    createRequestConfig(config, 'POST', '/v1/test', { data: `test-${i}` })
  }

  const end = performance.now()
  const duration = end - start
  const opsPerSecond = (iterations / duration) * 1000

  console.log(`Request Config: ${opsPerSecond.toFixed(0)} ops/sec`)
  expect(opsPerSecond).toBeGreaterThan(5000) // Should handle at least 5k ops/sec
})

test('Webhook signature verification performance', async () => {
  const iterations = 100
  const payload = '{"event_type":"ORDER_CREATED","order_id":"test"}'
  const secret = 'test-secret-key'

  // Generate a valid signature
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
  const signature = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    await verifyWebhookSignature(payload, signature, secret)
  }

  const end = performance.now()
  const duration = end - start
  const opsPerSecond = (iterations / duration) * 1000

  console.log(`Webhook Verification: ${opsPerSecond.toFixed(0)} ops/sec`)
  expect(opsPerSecond).toBeGreaterThan(50) // Should handle at least 50 ops/sec (crypto is slower)
})

test('Type checking overhead', () => {
  const iterations = 100000
  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    const testObj: Readonly<{ id: string; value: number }> = {
      id: `test-${i}`,
      value: i,
    }
    // Simulate type checking overhead
    void testObj.id
    void testObj.value
  }

  const end = performance.now()
  const duration = end - start
  const opsPerSecond = (iterations / duration) * 1000

  console.log(`Type Safety Overhead: ${opsPerSecond.toFixed(0)} ops/sec`)
  expect(opsPerSecond).toBeGreaterThan(100000) // Type checking should be very fast
})
