/**
 * Example: Creating a Payment Link
 * 
 * This example demonstrates how to create a shareable payment link
 * for customers to pay with cryptocurrency.
 */

import { createClient } from '../src/index'

async function createPaymentLink() {
  // Initialize the client
  const client = createClient({
    apiKey: process.env.SWAPPED_API_KEY ?? '',
    environment: 'sandbox', // Use 'production' for live environment
  })

  try {
    // Create a payment link/order
    const response = await client.paymentLinks.create({
      purchase: {
        name: 'Premium Subscription',
        description: 'Monthly subscription to premium features',
        notes: 'Includes access to all premium features',
        price: '99.99',
        currency: 'USD',
      },
      metadata: {
        customerEmail: 'customer@example.com',
        redirectUrl: 'https://example.com/success',
        externalId: 'order_123',
        customerId: 'customer_456',
      },
      testMode: false,
      preferredPayCurrency: {
        symbol: 'BTC',
        blockchain: 'bitcoin',
      },
    })

    if (response.success) {
      console.log('Payment link created successfully!')
      console.log('Order ID:', response.data.orderId)
      console.log('Payment Link:', response.data.paymentLink)
      console.log('\nShare this link with your customer to complete payment.')
    } else {
      console.error('Failed to create payment link:', response.message)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating payment link:', error.message)
    } else {
      console.error('Unknown error occurred')
    }
    process.exit(1)
  }
}

// Run the example
createPaymentLink()
