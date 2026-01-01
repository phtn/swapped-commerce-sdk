import type { HttpConfig, ApiResponse, BlockchainsResponse } from '../types'
import { request } from '../utils/http'

/**
 * List all available blockchains
 *
 * @example
 * ```typescript
 * const response = await client.blockchains.list()
 *
 * for (const blockchain of response.data) {
 *   console.log(`${blockchain.name} (${blockchain.symbol})`)
 *   console.log(`  - Chain ID: ${blockchain.chainId}`)
 *   console.log(`  - Explorer: ${blockchain.explorerUrl}`)
 *   console.log(`  - Currencies: ${blockchain.currencies.join(', ')}`)
 * }
 * ```
 */
export async function listBlockchains(
  httpConfig: HttpConfig
): Promise<ApiResponse<BlockchainsResponse>> {
  return request<BlockchainsResponse>(
    httpConfig.config,
    'GET',
    '/v1/blockchains'
  )
}
