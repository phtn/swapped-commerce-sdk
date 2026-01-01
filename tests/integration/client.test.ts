import { test, expect, describe, beforeAll } from 'bun:test'
import { createClient } from '../../src/index'

/**
 * Integration tests for Swapped Commerce SDK
 * 
 * These tests require:
 * - SWAPPED_API_KEY environment variable set
 * - Access to Swapped sandbox environment
 * 
 * To run these tests:
 *   SWAPPED_API_KEY=your-sandbox-key bun test tests/integration
 */

describe('Swapped Commerce SDK Integration Tests', () => {
  let client: ReturnType<typeof createClient>

  beforeAll(() => {
    const apiKey = process.env.SWAPPED_API_KEY
    if (!apiKey) {
      throw new Error(
        'SWAPPED_API_KEY environment variable is required for integration tests'
      )
    }

    client = createClient({
      apiKey,
      environment: 'sandbox',
      timeout: 30000,
      retries: 3,
    })
  })

  test('client is created successfully', () => {
    expect(client).toBeDefined()
    expect(client.orders).toBeDefined()
    expect(client.payments).toBeDefined()
    expect(client.balances).toBeDefined()
    expect(client.quotes).toBeDefined()
    expect(client.currencies).toBeDefined()
    expect(client.blockchains).toBeDefined()
    expect(client.payouts).toBeDefined()
    expect(client.kyc).toBeDefined()
  })

  test('can list orders', async () => {
    const response = await client.orders.list({ page: 1, limit: 10 })

    expect(response.success).toBe(true)
    expect(response.data).toBeDefined()
    expect(response.data.orders).toBeInstanceOf(Array)
    expect(response.data.pagination).toBeDefined()
  })

  test('can list balances', async () => {
    const response = await client.balances.list()

    expect(response.success).toBe(true)
    expect(response.data).toBeDefined()
    expect(response.data.balances).toBeInstanceOf(Array)
  })

  test('can get a quote', async () => {
    const response = await client.quotes.get({
      fromAmount: 25,
      fromFiatCurrency: 'EUR',
      toCurrency: 'TRX',
      toBlockchain: 'tron',
    })

    expect(response.success).toBe(true)
    expect(response.data).toBeDefined()
    expect(response.data.exchangeRateSnapshotId).toBeDefined()
    expect(response.data.fromAmount).toBeDefined()
    expect(response.data.fromAmount.amount).toBe('25.00')
    expect(response.data.fromAmount.currency.symbol).toBe('EUR')
    expect(response.data.toAmount).toBeDefined()
    expect(response.data.toAmount.beforeFees).toBeDefined()
    expect(response.data.toAmount.afterFees).toBeDefined()
    expect(response.data.toAmount.currency.symbol).toBe('TRX')
  })

  test('can list currencies', async () => {
    const response = await client.currencies.list()

    expect(response.success).toBe(true)
    expect(response.data).toBeDefined()
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data.length).toBeGreaterThan(0)

    const currency = response.data[0]
    expect(currency.id).toBeDefined()
    expect(currency.name).toBeDefined()
    expect(currency.symbol).toBeDefined()
    expect(currency.type).toBeDefined()
    expect(currency.precision).toBeDefined()
    expect(currency.blockchain).toBeDefined()
    expect(currency.currencyGroup).toBeDefined()
  })

  test('can list blockchains', async () => {
    const response = await client.blockchains.list()

    expect(response.success).toBe(true)
    expect(response.data).toBeDefined()
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data.length).toBeGreaterThan(0)

    const blockchain = response.data[0]
    expect(blockchain.id).toBeDefined()
    expect(blockchain.name).toBeDefined()
    expect(blockchain.symbol).toBeDefined()
    expect(blockchain.chainId).toBeDefined()
    expect(blockchain.explorerUrl).toBeDefined()
    expect(blockchain.ecosystem).toBeDefined()
    expect(blockchain.currencies).toBeDefined()
    expect(Array.isArray(blockchain.currencies)).toBe(true)
  })

  test('can list payouts', async () => {
    const response = await client.payouts.list({ page: 1, limit: 10 })

    expect(response.success).toBe(true)
    expect(response.data).toBeDefined()
    expect(response.data.payouts).toBeInstanceOf(Array)
    expect(response.data.pagination).toBeDefined()
  })

  test('webhook signature verification works', async () => {
    const payload = '{"event_type":"ORDER_CREATED","order_id":"test"}'
    const secret = 'test-secret'

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

    const isValid = await client.verifyWebhookSignature(payload, signature, secret)
    expect(isValid).toBe(true)

    const invalid = await client.verifyWebhookSignature(payload, 'invalid', secret)
    expect(invalid).toBe(false)
  })

  test('can parse webhook events', () => {
    const payload = JSON.stringify({
      event_type: 'ORDER_CREATED',
      order_id: 'order_123',
      order_status: 'AWAITING_PAYMENT',
      merchant_id: 'merchant_456',
      order_purchase_amount: 99.99,
      order_purchase_currency: 'USD',
    })

    const event = client.parseWebhookEvent(payload)

    expect(event.event_type).toBe('ORDER_CREATED')
    expect(event.order_id).toBe('order_123')
    expect(event.order_status).toBe('AWAITING_PAYMENT')
  })
})
