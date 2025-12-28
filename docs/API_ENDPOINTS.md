# API Endpoints Reference

This document lists all API endpoints used by the Swapped Commerce SDK.

## Endpoint Structure

### `/v1/merchants/*` - Transaction Data & Payment Management

Used for:
- Getting transaction data (payment methods, links)
- Reviewing payment-related details
- Processing refunds

**Endpoints:**
- `GET /v1/merchants/payments/{paymentId}` - Get payment details
- `POST /v1/merchants/orders/{orderId}/refund` - Process refund

### `/v1/*` - Core Resources

Used for:
- Creating and managing orders
- Creating payment routes
- Managing balances
- Getting quotes
- Managing payouts
- KYC operations

**Endpoints:**

#### Orders
- `GET /v1/orders` - List orders
- `GET /v1/orders/{orderId}` - Get order
- `POST /v1/orders` - Create order (payment link)

#### Payment Routes
- `POST /v1/payment-routes` - Create payment route

#### Balances
- `GET /v1/balances` - List balances
- `GET /v1/balances/{currencyId}` - Get balance

#### Quotes
- `POST /v1/quotes` - Get quote

#### Payouts
- `POST /v1/payouts` - Create payout
- `GET /v1/payouts` - List payouts
- `GET /v1/payouts/{payoutId}` - Get payout

#### KYC
- `GET /v1/kyc/{customerId}` - Get KYC status
- `POST /v1/kyc` - Submit KYC

## Summary

| Resource | Create | List/Get | Refund/Transaction |
|----------|--------|---------|-------------------|
| Orders | `/v1/orders` | `/v1/orders` | `/v1/merchants/orders/{id}/refund` |
| Payment Links | `/v1/orders` | - | - |
| Payment Routes | `/v1/payment-routes` | - | - |
| Payments | - | `/v1/merchants/payments/{id}` | - |
| Balances | - | `/v1/balances` | - |
| Quotes | `/v1/quotes` | - | - |
| Payouts | `/v1/payouts` | `/v1/payouts` | - |
| KYC | `/v1/kyc` | `/v1/kyc/{id}` | - |
