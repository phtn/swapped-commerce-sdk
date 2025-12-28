import type { Currency } from './currencies'
import type { Quote } from './quotes'

/**
 * Deposit address for payments
 */
export interface DepositAddress {
  readonly id: string
  readonly address: string
  readonly available: boolean
  readonly memo?: string
  readonly supportedCurrencies: readonly Currency[]
}

/**
 * Payment information
 */
export interface Payment {
  readonly id: string
  readonly orderId: string
  readonly receivedAmount: string
  readonly receivedCurrency: Currency
  readonly txHash: string
  readonly confirmedAt: string
  readonly status: string
  readonly createdAt: string
  readonly depositAddress: DepositAddress
  readonly sourceAddress: string
  readonly fireblocksTxId?: string
}

/**
 * Purchase information
 */
export interface Purchase {
  readonly id: string
  readonly name: string
  readonly notes?: string
  readonly imageUrl?: string
  readonly price: string
  readonly currency: Currency
  readonly rateMerchantOverOrder: string
}

/**
 * Purchase object for order creation
 */
export interface PurchaseInput {
  readonly name: string
  readonly description?: string
  readonly notes?: string
  readonly imageUrl?: string
  readonly price: string
  readonly currency: string
}

/**
 * Preferred payment currency
 */
export interface PreferredPayCurrency {
  readonly symbol: string
  readonly blockchain: string
}

/**
 * Order metadata
 */
export interface OrderMetadataInput {
  readonly externalId?: string
  readonly customerId?: string
  readonly customerCountry?: string
  readonly customerName?: string
  readonly customerLang?: string
  readonly customerEmail?: string
  readonly redirectUrl?: string
}

/**
 * Parameters for creating a payment link/order
 */
export interface CreateLinkParams {
  readonly purchase: PurchaseInput
  readonly metadata?: OrderMetadataInput
  readonly testMode?: boolean
  readonly preferredPayCurrency?: PreferredPayCurrency
}

/**
 * Response for creating a payment link
 */
export interface PaymentLinkResponse {
  readonly orderId: string
  readonly paymentLink: string
}

/**
 * Parameters for creating a payment route
 */
export interface CreateRouteParams {
  readonly purchaseAmount: string
  readonly purchaseCurrency: string
  readonly preferredPayCurrency?: string
  readonly externalId?: string
  readonly customerId?: string
  readonly metadata?: Readonly<Record<string, unknown>>
}

/**
 * Response for creating a payment route
 */
export interface PaymentRouteResponse {
  readonly orderId: string
  readonly depositAddress: DepositAddress
  readonly quote: Quote
}
