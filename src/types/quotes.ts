import type { Currency } from './currencies'

/**
 * Money amount with currency
 */
export interface MoneyAmount {
  readonly amount: string
  readonly currency: Currency
}

/**
 * Fee information
 */
export interface Fee {
  readonly id: string
  readonly type: string
  readonly label: string
  readonly amount: string
  readonly currency: Currency
  readonly createdAt: string
}

/**
 * Exchange quote
 */
export interface Quote {
  readonly fromAmount: MoneyAmount
  readonly toAmount: MoneyAmount
  readonly exchangeRateSnapshotId: string
  readonly fees: readonly Fee[]
}

/**
 * Parameters for getting a quote
 */
export interface GetQuoteParams {
  readonly fromCurrency: string
  readonly toCurrency: string
  readonly amount: string
  readonly amountType: 'FROM' | 'TO'
}

/**
 * Response for getting a quote
 */
export interface QuoteResponse {
  readonly quote: Quote
  readonly expiresAt: string
}
