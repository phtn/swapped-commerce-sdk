import type { OrderStatus } from './orders'

/**
 * Webhook event types
 */
export type WebhookEventType =
  | 'ORDER_CREATED'
  | 'PAYMENT_RECEIVED'
  | 'ORDER_COMPLETED'
  | 'SETTLEMENT_CREATED'
  | 'PAYMENT_CONVERSION_SETTLED'

/**
 * Webhook event payload
 */
export interface WebhookEvent {
  readonly event_type: WebhookEventType
  readonly order_id: string
  readonly order_status: OrderStatus
  readonly merchant_id: string
  readonly order_purchase_amount: number
  readonly order_purchase_currency: string
  readonly order_crypto?: string
  readonly order_crypto_amount?: number
  readonly network?: string
  readonly settlement_id?: string
  readonly from_amount?: number
  readonly from_currency?: string
  readonly from_network?: string
  readonly to_currency?: string
}
