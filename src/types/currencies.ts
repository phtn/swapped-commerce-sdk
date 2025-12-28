/**
 * Currency and blockchain types
 */
export type CurrencyType = 'FIAT' | 'CRYPTO'

export type CurrencyFlow = 'PAYMENT' | 'SETTLEMENT' | 'BOTH'

export interface Blockchain {
  readonly id: string
  readonly name: string
}

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
