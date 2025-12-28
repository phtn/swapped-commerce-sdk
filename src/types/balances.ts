import type { Currency } from './currencies'

/**
 * Balance information
 */
export interface Balance {
  readonly currency: Currency
  readonly available: string
  readonly pending: string
  readonly total: string
  readonly lastUpdated: string
}

/**
 * Parameters for listing balances
 */
export interface ListBalancesParams {
  readonly currency?: string
  readonly blockchain?: string
}

/**
 * Response for listing balances
 */
export interface BalancesResponse {
  readonly balances: readonly Balance[]
}
