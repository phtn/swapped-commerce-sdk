import type { Blockchain, Currency } from './currencies'

/**
 * Simplified currency info returned in quote responses
 */
export interface QuoteCurrency {
  readonly symbol: string
  readonly precision: number
  readonly type: 'FIAT' | 'CRYPTO'
  readonly blockchain: { readonly name: string } | null
}

/**
 * Money amount with currency (used in orders and other contexts)
 */
export interface MoneyAmount {
  readonly amount: string
  readonly currency: Currency
}

/**
 * Quote from amount with currency
 */
export interface QuoteFromAmount {
  readonly amount: string
  readonly currency: QuoteCurrency
}

/**
 * Quote to amount with before/after fees
 */
export interface QuoteToAmount {
  readonly beforeFees: string
  readonly afterFees: string
  readonly currency: QuoteCurrency
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
 * Exchange quote (used in orders)
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
  /** Amount to convert from */
  readonly fromAmount: string | number
  /** Source fiat currency symbol (e.g., 'EUR', 'USD') */
  readonly fromFiatCurrency: string
  /** Target currency symbol (e.g., 'TRX', 'USDT') */
  readonly toCurrency: string
  /** Target blockchain name (e.g., 'tron', 'ethereum') */
  readonly toBlockchain: string
}

/**
 * Response for getting a quote
 */
export interface QuoteResponse {
  readonly exchangeRateSnapshotId: string
  readonly fromAmount: QuoteFromAmount
  readonly toAmount: QuoteToAmount
}
