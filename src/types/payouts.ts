import type { Currency } from './currencies'

/**
 * Bank destination for payouts
 */
export interface BankDestination {
  readonly accountNumber: string
  readonly routingNumber?: string
  readonly iban?: string
  readonly swift?: string
  readonly accountHolderName: string
}

/**
 * Crypto destination for payouts
 */
export interface CryptoDestination {
  readonly address: string
  readonly blockchain: string
  readonly memo?: string
}

/**
 * Payout status
 */
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

/**
 * Payout information
 */
export interface Payout {
  readonly id: string
  readonly amount: string
  readonly currency: Currency
  readonly destination: BankDestination | CryptoDestination
  readonly status: PayoutStatus
  readonly createdAt: string
  readonly completedAt?: string
  readonly failureReason?: string
}

/**
 * Parameters for creating a payout
 */
export interface CreatePayoutParams {
  readonly amount: string
  readonly currency: string
  readonly destinationType: 'BANK' | 'CRYPTO'
  readonly destination: BankDestination | CryptoDestination
  readonly reference?: string
}

/**
 * Response for creating a payout
 */
export interface CreatePayoutResponse {
  readonly payoutId: string
  readonly status: string
  readonly estimatedArrival: string
}

/**
 * Response for listing payouts
 */
export interface PayoutsResponse {
  readonly payouts: readonly Payout[]
  readonly pagination: import('./common').PaginationResponse
}
