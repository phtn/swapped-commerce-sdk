/**
 * Currency and blockchain types
 */
export type CurrencyType = 'FIAT' | 'CRYPTO'

export type CurrencyFlow = 'PAYMENT' | 'SETTLEMENT' | 'BOTH'

/**
 * Currency group information
 */
export interface CurrencyGroup {
  readonly id: string
  readonly name: string
}

/**
 * Basic blockchain information (used in simple contexts)
 */
export interface Blockchain {
  readonly id: string
  readonly name: string
}

/**
 * Full blockchain information (returned from /v1/currencies)
 */
export interface BlockchainFull {
  readonly id: string
  readonly name: string
  readonly ecosystem: string
  readonly krakenId?: string | null
  readonly bybitId: string
  readonly binanceId: string
  readonly symbol: string
}

/**
 * Complete blockchain information (returned from /v1/blockchains)
 */
export interface BlockchainComplete {
  readonly id: string
  readonly name: string
  readonly symbol: string
  readonly chainId: string
  readonly rpcUrl: string
  readonly explorerUrl: string
  readonly paymentTtlInSeconds: number
  readonly regex: string
  readonly krakenId?: string | null
  readonly bybitId: string
  readonly binanceId: string
  readonly createdAt: string
  readonly ecosystem: string
  readonly currencies: readonly string[]
}

/**
 * Response from listing blockchains
 */
export type BlockchainsResponse = readonly BlockchainComplete[]

/**
 * Basic currency interface (used in orders/payments)
 */
export interface Currency {
  readonly id: string
  readonly symbol: string
  readonly name: string
  readonly officialId: string
  readonly type: CurrencyType
  readonly precision: number
  readonly flows: readonly CurrencyFlow[]
  readonly blockchain?: Blockchain
  readonly blockchainId?: string
  readonly isStablecoin?: boolean
  readonly decimals?: number
  readonly isNative?: boolean
}

/**
 * Full currency information (returned from /v1/currencies)
 */
export interface CurrencyFull {
  readonly id: string
  readonly name: string
  readonly symbol: string
  readonly type: string
  readonly precision: number
  readonly flows: readonly string[]
  readonly decimals: number
  readonly officialId: string
  readonly fireblocksId: string
  readonly isNative: boolean
  readonly isStablecoin: boolean
  readonly needsCustomGasStation: boolean
  readonly gasThreshold: string
  readonly currencyGroup: CurrencyGroup
  readonly blockchain: BlockchainFull
}

/**
 * Response from listing currencies
 */
export type CurrenciesResponse = readonly CurrencyFull[]
