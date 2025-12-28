import type { Currency } from './currencies'
import type { Quote } from './quotes'
import type { DepositAddress, Payment, Purchase } from './payments'

/**
 * Order initialization type
 */
export type OrderInitType = 'STANDARD' | 'INVOICE' | 'PAYMENT_ROUTE'

/**
 * Order status
 */
export type OrderStatus =
  | 'PENDING_USER_CREATION'
  | 'PENDING_CURRENCY_SELECTION'
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_CONFIRMED_ACCURATE'
  | 'PAYMENT_CONFIRMED_UNDERPAID'
  | 'PAYMENT_CONFIRMED_OVERPAID'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELLED'

/**
 * Order metadata
 */
export interface OrderMetadata {
  readonly externalId?: string
  readonly userId?: string
  readonly customerId?: string
  readonly userName?: string
  readonly customerName?: string
  readonly userLang?: string
  readonly customerLang?: string
  readonly userCountry?: string
  readonly customerCountry?: string
  readonly userEmail?: string
  readonly customerEmail?: string
  readonly redirectUrl?: string
}

/**
 * Order update
 */
export interface OrderUpdate {
  readonly id: string
  readonly message: string
  readonly entityType: string
  readonly authorId: string
  readonly metadata: Readonly<Record<string, unknown>>
  readonly timestamp: string
}

/**
 * Settlement information
 */
export interface Settlement {
  readonly id: string
  readonly type: string
  readonly status: string
}

/**
 * Complete order information
 */
export interface Order {
  readonly id: string
  readonly link: string
  readonly externalId: string
  readonly userId: string
  readonly customerId: string
  readonly merchant: {
    readonly id: string
  }
  readonly initType: OrderInitType
  readonly quote: Quote
  readonly depositAddress: DepositAddress
  readonly settlements: readonly Settlement[]
  readonly payments: readonly Payment[]
  readonly expiresAt: string
  readonly createdAt: string
  readonly status: OrderStatus
  readonly purchase?: Purchase
  readonly updates: readonly OrderUpdate[]
  readonly metadata: OrderMetadata
  readonly preferredPayCurrency?: Currency
}

/**
 * Parameters for listing orders
 */
export interface ListOrdersParams {
  readonly page?: number
  readonly limit?: number
  readonly searchId?: string
  readonly startDate?: number
  readonly endDate?: number
  readonly type?: OrderInitType
}

/**
 * Response for listing orders
 */
export interface OrdersResponse {
  readonly orders: readonly Order[]
  readonly pagination: import('./common').PaginationResponse
}

/**
 * Parameters for refunding an order
 */
export interface RefundParams {
  readonly amount?: string
  readonly reason?: string
}

/**
 * Response for refund operation
 */
export interface RefundResponse {
  readonly refundId: string
}
