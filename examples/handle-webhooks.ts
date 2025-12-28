/**
 * Example: Handling Webhooks
 * 
 * This example demonstrates how to verify and handle webhook events
 * from Swapped Commerce API.
 */

import { createClient, parseWebhookEvent, verifyWebhookSignature } from '../src/index'

/**
 * Example webhook handler for a Bun server
 */
async function handleWebhook(
  payload: string,
  signature: string,
  webhookSecret: string
): Promise<void> {
  // Verify the webhook signature
  const isValid = await verifyWebhookSignature(payload, signature, webhookSecret)

  if (!isValid) {
    throw new Error('Invalid webhook signature')
  }

  // Parse the webhook event
  const event = parseWebhookEvent(payload)

  // Handle different event types
  switch (event.event_type) {
    case 'ORDER_CREATED':
      console.log('New order created:', event.order_id)
      console.log('Purchase amount:', event.order_purchase_amount, event.order_purchase_currency)
      // Handle order creation logic here
      break

    case 'PAYMENT_RECEIVED':
      console.log('Payment received for order:', event.order_id)
      console.log('Crypto amount:', event.order_crypto_amount, event.order_crypto)
      // Handle payment received logic here
      break

    case 'ORDER_COMPLETED':
      console.log('Order completed:', event.order_id)
      // Handle order completion logic here
      // e.g., fulfill the order, send confirmation email, etc.
      break

    case 'SETTLEMENT_CREATED':
      console.log('Settlement created:', event.settlement_id)
      console.log('From:', event.from_amount, event.from_currency)
      console.log('To:', event.to_currency)
      // Handle settlement creation logic here
      break

    case 'PAYMENT_CONVERSION_SETTLED':
      console.log('Payment conversion settled for order:', event.order_id)
      // Handle conversion settlement logic here
      break

    default:
      console.log('Unknown event type:', event.event_type)
  }
}

/**
 * Example Bun server endpoint for webhooks
 */
export function createWebhookHandler(webhookSecret: string) {
  return async (req: Request): Promise<Response> => {
    try {
      // Get the signature from headers
      const signature = req.headers.get('X-Signature') ?? ''

      // Read the request body
      const payload = await req.text()

      // Handle the webhook
      await handleWebhook(payload, signature, webhookSecret)

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Webhook handling error:', error)
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }
}

// Example usage with Bun.serve
if (import.meta.main) {
  const webhookSecret = process.env.WEBHOOK_SECRET ?? ''

  Bun.serve({
    port: 3000,
    async fetch(req) {
      if (req.method === 'POST' && req.url.endsWith('/webhook')) {
        return createWebhookHandler(webhookSecret)(req)
      }
      return new Response('Not Found', { status: 404 })
    },
  })

  console.log('Webhook server listening on http://localhost:3000/webhook')
}
