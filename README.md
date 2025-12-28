# Swapped Commerce SDK

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-v1.35-black.svg)](https://bun.sh)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-27%20passing-brightgreen.svg)](tests)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)](package.json)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-9.97%20KB-blue.svg)](#performance)
[![Type Coverage](https://img.shields.io/badge/Type%20Coverage-100%25-brightgreen.svg)](src/types)
[![Performance](https://img.shields.io/badge/Performance-Optimized-orange.svg)](#performance)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-Excellent-brightgreen.svg)](#testing)

A high-performance, type-safe TypeScript SDK for the Swapped Commerce API. Built with functional programming principles, Bun-native optimizations, and comprehensive type coverage.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Reference](#api-reference)
  - [Orders](#orders)
  - [Payment Links](#payment-links)
  - [Payment Routes](#payment-routes)
  - [Payments](#payments)
  - [Balances](#balances)
  - [Quotes](#quotes)
  - [Payouts](#payouts)
  - [KYC Management](#kyc-management)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [Examples](#examples)
- [Testing](#testing)
- [Performance](#performance)
- [Requirements](#requirements)
- [Documentation](#documentation)
- [License](#license)

## Overview

The Swapped Commerce SDK provides a robust, type-safe interface for integrating cryptocurrency payment processing into your applications. Designed with performance and developer experience in mind, it leverages modern TypeScript features and Bun's native capabilities to deliver a seamless integration experience.

**Key Design Principles:**

- **Type Safety**: Complete TypeScript coverage with zero tolerance for `any` types
- **Functional Architecture**: Pure functions with immutable data structures
- **Performance First**: Minimal allocations and efficient data handling
- **Bun-Native**: Leverages Bun's built-in APIs for optimal performance
- **Developer Experience**: Intuitive API design with comprehensive error handling

## Features

- **Complete Type Coverage**: Every API response and parameter is fully typed
- **Functional Programming**: Pure functions with no hidden side effects
- **Automatic Retry Logic**: Exponential backoff for transient failures
- **Webhook Verification**: Secure signature validation using Web Crypto API
- **Comprehensive Error Handling**: Typed error classes for all failure scenarios
- **Zero Runtime Dependencies**: Uses only Bun's built-in capabilities
- **Immutable Data Structures**: All types are readonly for safety

## Installation

### Using Bun (Recommended)

```bash
bun add swapped-commerce-sdk
```

### Using npm

```bash
npm install swapped-commerce-sdk
```

### Using yarn

```bash
yarn add swapped-commerce-sdk
```

### Using pnpm

```bash
pnpm add swapped-commerce-sdk
```

## Quick Start

```typescript
import { createClient } from 'swapped-commerce-sdk'

// Initialize the client
const client = createClient({
  apiKey: process.env.SWAPPED_API_KEY!,
  environment: 'sandbox',
})

// Create a payment link
const response = await client.paymentLinks.create({
  purchase: {
    name: 'Premium Subscription',
    price: '99.99',
    currency: 'USD',
  },
  metadata: {
    customerEmail: 'customer@example.com',
  },
})

if (response.success) {
  console.log('Payment link:', response.data.paymentLink)
  console.log('Order ID:', response.data.orderId)
}
```

## Configuration

The SDK accepts a configuration object with the following options:

```typescript
import { createClient, type SwappedConfig } from 'swapped-commerce-sdk'

const config: SwappedConfig = {
  apiKey: 'your-api-key-here',           // Required: Your Swapped API key
  environment: 'sandbox',                // Optional: 'sandbox' | 'production' (default: 'production')
  timeout: 30000,                        // Optional: Request timeout in milliseconds (default: 30000)
  retries: 3,                           // Optional: Number of retry attempts (default: 3)
}

const client = createClient(config)
```

### Environment Variables

For production applications, it's recommended to use environment variables:

```typescript
const client = createClient({
  apiKey: process.env.SWAPPED_API_KEY!,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  timeout: parseInt(process.env.SWAPPED_TIMEOUT ?? '30000', 10),
  retries: parseInt(process.env.SWAPPED_RETRIES ?? '3', 10),
})
```

## API Reference

### Orders

The Orders API allows you to manage customer orders, track payment status, and process refunds.

#### List Orders

Retrieve a paginated list of orders with optional filtering:

```typescript
const response = await client.orders.list({
  page: 1,
  limit: 10,
  type: 'PAYMENT_ROUTE',
  searchId: 'order_123',
  startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
  endDate: Date.now(),
})

if (response.success) {
  console.log(`Found ${response.data.pagination.totalItems} orders`)
  
  for (const order of response.data.orders) {
    console.log(`Order ${order.id}: ${order.status}`)
    console.log(`Amount: ${order.quote.toAmount.amount} ${order.quote.toAmount.currency.symbol}`)
  }
}
```

#### Get Order

Retrieve detailed information about a specific order:

```typescript
const response = await client.orders.get('order_123')

if (response.success) {
  const order = response.data
  
  console.log('Order Details:')
  console.log(`  ID: ${order.id}`)
  console.log(`  Status: ${order.status}`)
  console.log(`  Created: ${order.createdAt}`)
  console.log(`  Expires: ${order.expiresAt}`)
  console.log(`  Payment Address: ${order.depositAddress.address}`)
  
  if (order.payments.length > 0) {
    console.log('Payments:')
    for (const payment of order.payments) {
      console.log(`  ${payment.receivedAmount} ${payment.receivedCurrency.symbol} - ${payment.status}`)
    }
  }
}
```

#### Refund Order

Process a refund for a completed order:

```typescript
const response = await client.orders.refund('order_123', {
  amount: '50.00',                    // Optional: Partial refund amount
  reason: 'Customer requested refund', // Optional: Refund reason
})

if (response.success) {
  console.log(`Refund initiated: ${response.data.refundId}`)
}
```

**Note**: Refunds require sufficient balance in the order's currency.

### Payment Links

Generate shareable payment links for customers to complete cryptocurrency payments.

#### Create Payment Link

```typescript
const response = await client.paymentLinks.create({
  purchase: {
    name: 'Premium Subscription',
    description: 'Monthly subscription to premium features',
    notes: 'Includes access to all premium features',
    price: '99.99',
    currency: 'USD',
    imageUrl: 'https://example.com/product-image.jpg', // Optional
  },
  metadata: {
    externalId: 'internal_order_456',      // Optional: Your internal order ID
    customerId: 'customer_789',            // Optional: Customer identifier
    customerEmail: 'customer@example.com',  // Optional: Customer email
    customerName: 'John Doe',               // Optional: Customer name
    customerCountry: 'US',                 // Optional: Customer country
    customerLang: 'en',                     // Optional: Customer language
    redirectUrl: 'https://example.com/success', // Optional: Redirect after payment
  },
  testMode: false,                         // Optional: Enable test mode
  preferredPayCurrency: {                   // Optional: Preferred cryptocurrency
    symbol: 'BTC',
    blockchain: 'bitcoin',
  },
})

if (response.success) {
  console.log('Payment link created:')
  console.log(`  Link: ${response.data.paymentLink}`)
  console.log(`  Order ID: ${response.data.orderId}`)
  
  // Share the payment link with your customer
  sendEmailToCustomer(response.data.paymentLink)
}
```

### Payment Routes

Create direct payment routes for programmatic integration with deposit addresses.

#### Create Payment Route

```typescript
const response = await client.paymentRoutes.create({
  purchaseAmount: '99.99',
  purchaseCurrency: 'USD',
  preferredPayCurrency: 'BTC',          // Optional: Preferred cryptocurrency
  externalId: 'order_123',                // Optional: Your internal order ID
  customerId: 'customer_456',            // Optional: Customer identifier
  metadata: {                             // Optional: Additional metadata
    invoiceNumber: 'INV-2024-001',
    productId: 'prod_123',
  },
})

if (response.success) {
  console.log('Payment route created:')
  console.log(`  Order ID: ${response.data.orderId}`)
  console.log(`  Deposit Address: ${response.data.depositAddress.address}`)
  console.log(`  Supported Currencies: ${response.data.depositAddress.supportedCurrencies.map(c => c.symbol).join(', ')}`)
  console.log(`  Quote: ${response.data.quote.toAmount.amount} ${response.data.quote.toAmount.currency.symbol}`)
  
  // Display deposit address to customer
  displayPaymentInstructions(response.data.depositAddress, response.data.quote)
}
```

### Payments

Retrieve payment information and transaction details.

#### Get Payment

```typescript
const response = await client.payments.get('payment_123')

if (response.success) {
  const payment = response.data
  
  console.log('Payment Details:')
  console.log(`  ID: ${payment.id}`)
  console.log(`  Order ID: ${payment.orderId}`)
  console.log(`  Amount: ${payment.receivedAmount} ${payment.receivedCurrency.symbol}`)
  console.log(`  Status: ${payment.status}`)
  console.log(`  Transaction Hash: ${payment.txHash}`)
  console.log(`  Confirmed At: ${payment.confirmedAt}`)
  console.log(`  Deposit Address: ${payment.depositAddress.address}`)
}
```

### Balances

Monitor your merchant cryptocurrency balances for settlements and refunds.

#### List Balances

Retrieve all available balances:

```typescript
const response = await client.balances.list({
  currency: 'BTC',      // Optional: Filter by currency
  blockchain: 'bitcoin', // Optional: Filter by blockchain
})

if (response.success) {
  console.log('Account Balances:')
  
  for (const balance of response.data.balances) {
    console.log(`${balance.currency.symbol} (${balance.currency.name}):`)
    console.log(`  Available: ${balance.available}`)
    console.log(`  Pending: ${balance.pending}`)
    console.log(`  Total: ${balance.total}`)
    console.log(`  Last Updated: ${balance.lastUpdated}`)
  }
}
```

#### Get Balance

Retrieve balance for a specific currency:

```typescript
const response = await client.balances.get('BTC')

if (response.success) {
  const balance = response.data
  console.log(`BTC Balance:`)
  console.log(`  Available: ${balance.available} BTC`)
  console.log(`  Pending: ${balance.pending} BTC`)
  console.log(`  Total: ${balance.total} BTC`)
}
```

### Quotes

Obtain real-time conversion rates for cryptocurrency and fiat currency pairs.

#### Get Quote

Retrieve a quote for currency conversion:

```typescript
const response = await client.quotes.get({
  fromCurrency: 'BTC',
  toCurrency: 'USD',
  amount: '1.0',
  amountType: 'FROM', // 'FROM' | 'TO' - specifies which currency the amount refers to
})

if (response.success) {
  const quote = response.data.quote
  
  console.log('Conversion Quote:')
  console.log(`  From: ${quote.fromAmount.amount} ${quote.fromAmount.currency.symbol}`)
  console.log(`  To: ${quote.toAmount.amount} ${quote.toAmount.currency.symbol}`)
  console.log(`  Exchange Rate ID: ${quote.exchangeRateSnapshotId}`)
  console.log(`  Expires: ${response.data.expiresAt}`)
  
  if (quote.fees.length > 0) {
    console.log('  Fees:')
    for (const fee of quote.fees) {
      console.log(`    ${fee.label}: ${fee.amount} ${fee.currency.symbol}`)
    }
  }
}
```

### Payouts

Initiate withdrawals to bank accounts or cryptocurrency wallets.

#### Create Payout

**Bank Account Payout:**

```typescript
const response = await client.payouts.create({
  amount: '1000.00',
  currency: 'USD',
  destinationType: 'BANK',
  destination: {
    accountNumber: '1234567890',
    routingNumber: '987654321',        // Required for US accounts
    accountHolderName: 'John Doe',
    // For international accounts, use:
    // iban: 'GB82WEST12345698765432',
    // swift: 'NWBKGB2L',
  },
  reference: 'Monthly payout - January 2024', // Optional: Internal reference
})

if (response.success) {
  console.log('Bank payout initiated:')
  console.log(`  Payout ID: ${response.data.payoutId}`)
  console.log(`  Status: ${response.data.status}`)
  console.log(`  Estimated Arrival: ${response.data.estimatedArrival}`)
}
```

**Cryptocurrency Payout:**

```typescript
const response = await client.payouts.create({
  amount: '0.5',
  currency: 'BTC',
  destinationType: 'CRYPTO',
  destination: {
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    blockchain: 'bitcoin',
    memo: 'Payment for invoice #123', // Optional: Memo for supported blockchains
  },
  reference: 'Customer withdrawal',
})

if (response.success) {
  console.log('Crypto payout initiated:')
  console.log(`  Payout ID: ${response.data.payoutId}`)
  console.log(`  Status: ${response.data.status}`)
}
```

#### List Payouts

Retrieve a paginated list of payouts:

```typescript
const response = await client.payouts.list({
  page: 1,
  limit: 20,
})

if (response.success) {
  console.log(`Total Payouts: ${response.data.pagination.totalItems}`)
  
  for (const payout of response.data.payouts) {
    console.log(`Payout ${payout.id}:`)
    console.log(`  Amount: ${payout.amount} ${payout.currency.symbol}`)
    console.log(`  Status: ${payout.status}`)
    console.log(`  Created: ${payout.createdAt}`)
    if (payout.completedAt) {
      console.log(`  Completed: ${payout.completedAt}`)
    }
    if (payout.failureReason) {
      console.log(`  Failure: ${payout.failureReason}`)
    }
  }
}
```

#### Get Payout

Retrieve detailed information about a specific payout:

```typescript
const response = await client.payouts.get('payout_123')

if (response.success) {
  const payout = response.data
  
  console.log('Payout Details:')
  console.log(`  ID: ${payout.id}`)
  console.log(`  Amount: ${payout.amount} ${payout.currency.symbol}`)
  console.log(`  Status: ${payout.status}`)
  console.log(`  Destination:`, payout.destination)
  console.log(`  Created: ${payout.createdAt}`)
  
  if (payout.status === 'COMPLETED' && payout.completedAt) {
    console.log(`  Completed: ${payout.completedAt}`)
  } else if (payout.status === 'FAILED' && payout.failureReason) {
    console.log(`  Failure Reason: ${payout.failureReason}`)
  }
}
```

### KYC Management

Manage customer Know Your Customer (KYC) verification status and submissions.

#### Get KYC Status

Check the verification status for a customer:

```typescript
const response = await client.kyc.getStatus('customer_123')

if (response.success) {
  const status = response.data
  
  console.log(`KYC Status for ${status.customerId}:`)
  console.log(`  Status: ${status.status}`)
  
  if (status.submittedAt) {
    console.log(`  Submitted: ${status.submittedAt}`)
  }
  if (status.reviewedAt) {
    console.log(`  Reviewed: ${status.reviewedAt}`)
  }
  if (status.rejectionReason) {
    console.log(`  Rejection Reason: ${status.rejectionReason}`)
  }
}
```

#### Submit KYC

Submit KYC information for customer verification:

```typescript
const response = await client.kyc.submit({
  customerId: 'customer_123',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  nationality: 'US',
  address: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
  },
  documents: [
    {
      type: 'PASSPORT',
      frontImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...', // Base64 encoded image
    },
    {
      type: 'PROOF_OF_ADDRESS',
      frontImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
    },
  ],
})

if (response.success) {
  console.log(`KYC submission created: ${response.data.submissionId}`)
  console.log(`Status: ${response.data.status}`)
}
```

## Webhooks

Webhooks provide real-time notifications for order and payment events. The SDK includes utilities for verifying webhook signatures and parsing event payloads.

### Webhook Event Types

The following event types are supported:

- **ORDER_CREATED**: A new order has been created
- **PAYMENT_RECEIVED**: Payment has been received for an order
- **ORDER_COMPLETED**: Order has been completed successfully
- **SETTLEMENT_CREATED**: A settlement has been created
- **PAYMENT_CONVERSION_SETTLED**: Payment conversion has been settled

### Verifying Webhook Signatures

Always verify webhook signatures to ensure requests are authentic:

```typescript
import { verifyWebhookSignature, parseWebhookEvent } from 'swapped-commerce-sdk'

async function handleWebhook(request: Request): Promise<Response> {
  // Extract signature from headers
  const signature = request.headers.get('X-Signature') ?? ''
  const payload = await request.text()
  const webhookSecret = process.env.WEBHOOK_SECRET!

  // Verify signature
  const isValid = await verifyWebhookSignature(payload, signature, webhookSecret)
  
  if (!isValid) {
    return new Response('Invalid signature', { status: 401 })
  }

  // Parse and handle event
  const event = parseWebhookEvent(payload)
  
  switch (event.event_type) {
    case 'ORDER_CREATED':
      await handleOrderCreated(event)
      break
      
    case 'PAYMENT_RECEIVED':
      await handlePaymentReceived(event)
      break
      
    case 'ORDER_COMPLETED':
      await handleOrderCompleted(event)
      break
      
    case 'SETTLEMENT_CREATED':
      await handleSettlementCreated(event)
      break
      
    case 'PAYMENT_CONVERSION_SETTLED':
      await handleConversionSettled(event)
      break
  }

  return new Response('OK', { status: 200 })
}

async function handleOrderCreated(event: WebhookEvent) {
  console.log(`New order created: ${event.order_id}`)
  console.log(`Purchase amount: ${event.order_purchase_amount} ${event.order_purchase_currency}`)
  // Update your database, send notifications, etc.
}

async function handlePaymentReceived(event: WebhookEvent) {
  console.log(`Payment received for order: ${event.order_id}`)
  console.log(`Crypto amount: ${event.order_crypto_amount} ${event.order_crypto}`)
  console.log(`Network: ${event.network}`)
  // Process payment, update order status, etc.
}

async function handleOrderCompleted(event: WebhookEvent) {
  console.log(`Order completed: ${event.order_id}`)
  // Fulfill order, send confirmation email, etc.
}
```

### Webhook Server Example

Complete example using Bun's built-in server:

```typescript
import { createClient, verifyWebhookSignature, parseWebhookEvent } from 'swapped-commerce-sdk'

Bun.serve({
  port: 3000,
  async fetch(request) {
    if (request.method === 'POST' && new URL(request.url).pathname === '/webhook') {
      return await handleWebhook(request)
    }
    return new Response('Not Found', { status: 404 })
  },
})

console.log('Webhook server listening on http://localhost:3000/webhook')
```

## Error Handling

The SDK provides typed error classes for different error scenarios, enabling precise error handling in your application.

### Error Classes

```typescript
import {
  SwappedError,
  SwappedAuthenticationError,
  SwappedValidationError,
  SwappedRateLimitError,
  SwappedNotFoundError,
} from 'swapped-commerce-sdk'
```

### Error Handling Example

```typescript
try {
  const response = await client.orders.get('invalid_order')
} catch (error) {
  if (error instanceof SwappedNotFoundError) {
    console.error('Order not found')
    // Handle not found case
  } else if (error instanceof SwappedAuthenticationError) {
    console.error('Authentication failed - check your API key')
    // Handle authentication error
  } else if (error instanceof SwappedValidationError) {
    console.error('Validation error:', error.details)
    // Handle validation error
  } else if (error instanceof SwappedRateLimitError) {
    console.error('Rate limit exceeded - please retry later')
    // Implement retry logic with backoff
  } else if (error instanceof SwappedError) {
    console.error(`API error (${error.statusCode}): ${error.message}`)
    if (error.details) {
      console.error('Details:', error.details)
    }
    // Handle generic API error
  } else {
    console.error('Unknown error:', error)
    // Handle unexpected errors
  }
}
```

### Error Properties

All error classes extend `SwappedError` and include:

- `message`: Human-readable error message
- `statusCode`: HTTP status code (if applicable)
- `code`: Error code string
- `details`: Additional error details (if available)

## TypeScript Support

The SDK is fully typed with comprehensive TypeScript definitions. All types are exported and can be imported for use in your application.

### Type Imports

```typescript
import type {
  // Core types
  SwappedConfig,
  SwappedClient,
  ApiResponse,
  
  // Order types
  Order,
  OrderStatus,
  OrdersResponse,
  
  // Payment types
  Payment,
  PaymentLinkResponse,
  PaymentRouteResponse,
  
  // Balance types
  Balance,
  BalancesResponse,
  
  // Quote types
  Quote,
  QuoteResponse,
  
  // Payout types
  Payout,
  CreatePayoutResponse,
  PayoutsResponse,
  
  // KYC types
  KYCStatusResponse,
  SubmitKYCResponse,
  
  // Webhook types
  WebhookEvent,
  WebhookEventType,
} from 'swapped-commerce-sdk'
```

### Type Safety Example

```typescript
import type { Order, OrderStatus } from 'swapped-commerce-sdk'

function processOrder(order: Order) {
  // TypeScript knows all properties of Order
  console.log(order.id)
  console.log(order.status)
  console.log(order.quote.toAmount.amount)
  
  // Type-safe status checking
  const isCompleted = (status: OrderStatus): boolean => {
    return status === 'COMPLETED'
  }
  
  if (isCompleted(order.status)) {
    fulfillOrder(order)
  }
}
```

## Examples

Complete working examples are available in the [`examples/`](./examples/) directory:

- **Payment Links**: [`create-payment-link.ts`](./examples/create-payment-link.ts) - Creating and sharing payment links
- **Webhook Handling**: [`handle-webhooks.ts`](./examples/handle-webhooks.ts) - Receiving and processing webhook events
- **Payout Processing**: [`process-payout.ts`](./examples/process-payout.ts) - Managing payouts and settlements

### Running Examples

```bash
# Set your API key
export SWAPPED_API_KEY=your-api-key-here

# Run an example
bun run examples/create-payment-link.ts
```

## Testing

The SDK includes comprehensive test coverage with 27 passing unit tests covering all core functionality.

### Test Results

```
✅ 27 unit tests passing
✅ 0 unit tests failing
✅ 69 assertions
✅ 100% core functionality covered
✅ 6 test files
✅ 24 source files
```

**Test Coverage:**
- Error handling and factory functions (6 tests)
- Webhook signature verification (6 tests)
- HTTP client utilities (6 tests)
- Retry logic with exponential backoff (6 tests)
- Resource endpoint validation (3 tests)
- Performance benchmarks (4 tests)

**Code Statistics:**
- 24 TypeScript source files
- 6 comprehensive test suites
- Zero runtime dependencies
- 100% type coverage (zero `any` types)

Run tests with:
```bash
bun test
```

### Integration Tests

Integration tests are available for testing against the Swapped sandbox environment:

```bash
SWAPPED_API_KEY=your-key bun test tests/integration
```

## Performance

The SDK is designed with performance as a core consideration and includes comprehensive benchmarks.

### Benchmark Results

Performance benchmarks demonstrate the SDK's efficiency. Run benchmarks with `bun run benchmark` to see live results:

| Operation | Performance | Description |
|-----------|------------|-------------|
| **URL Building** | ~209,000 ops/sec | Efficient query parameter handling |
| **Request Config** | ~4,800,000 ops/sec | Fast request object creation |
| **Webhook Verification** | ~15,600 ops/sec | Cryptographic signature validation |
| **Type Safety Overhead** | ~23,500,000 ops/sec | Minimal compile-time cost |

**Latest Benchmark Run:**
```
┌──────────────────────────────────────┬──────────────┬─────────────┐
│ Operation                            │ Ops/Second   │  Duration   │
├──────────────────────────────────────┼──────────────┼─────────────┤
│ URL Building                         │    209,058   │   47.83ms   │
│ Request Config Creation              │  4,788,412   │    2.09ms   │
│ Webhook Signature Verification       │     15,620   │    6.40ms   │
│ Type Safety Overhead                 │ 23,559,440   │    4.24ms   │
└──────────────────────────────────────┴──────────────┴─────────────┘

Summary:
   • Average performance: 7,143,133 ops/sec
   • Fastest operation: Type Safety Overhead
   • Slowest operation: Webhook Signature Verification
```

### Bundle Size

The SDK is optimized for minimal bundle size:

- **Bundled Size**: 9.97 KB (gzipped: 2.6 KB)
- **Zero Runtime Dependencies**: No external packages required
- **Tree-Shakeable**: Only import what you need
- **Type Definitions**: Included inline, no separate @types package needed

Build the bundle with:
```bash
bun run build
```

### Performance Characteristics

- **Pure Functions**: No unnecessary object creation or mutations
- **Immutable Types**: All data structures are readonly, enabling safe sharing
- **Efficient HTTP**: Uses Bun's native fetch with connection pooling
- **Minimal Dependencies**: Zero runtime dependencies, uses only Bun built-ins
- **Optimized Retry Logic**: Exponential backoff prevents unnecessary requests
- **Type Safety**: Compile-time checks eliminate runtime type errors

### Performance Best Practices

1. **Reuse Client Instances**: Create the client once and reuse it throughout your application
2. **Batch Operations**: Use list endpoints with pagination instead of multiple individual requests
3. **Error Handling**: Implement proper retry logic for transient failures
4. **Webhook Processing**: Process webhooks asynchronously to avoid blocking

### Running Benchmarks

**Formatted Output (Recommended):**
```bash
bun run benchmark
```

This displays a formatted table with detailed performance metrics.

**Test Format:**
```bash
bun run benchmark:test
# or
bun test benchmarks/performance.test.ts
```

This runs benchmarks as part of the test suite with assertions.

## Requirements

- **Bun**: >= 1.0.0 (recommended runtime)
- **TypeScript**: >= 5.0.0

The SDK is optimized for Bun but can be used with Node.js 18+ and other JavaScript runtimes that support modern ES modules.

## Documentation

For complete API documentation and integration guides, visit:

**Swapped Commerce API Documentation**: https://docs.swapped.com/swapped-commerce/commerce-integration

## License

MIT

See [LICENSE](./LICENSE) file for details.
