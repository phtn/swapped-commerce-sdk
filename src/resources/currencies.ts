import type { HttpConfig, ApiResponse, CurrenciesResponse } from '../types'
import { request } from '../utils/http'

/**
 * List all available currencies
 *
 * @example
 * ```typescript
 * const response = await client.currencies.list()
 *
 * for (const currency of response.data) {
 *   console.log(`${currency.name} (${currency.symbol}) on ${currency.blockchain.name}`)
 * }
 * ```
 */
export async function listCurrencies(
  httpConfig: HttpConfig
): Promise<ApiResponse<CurrenciesResponse>> {
  return request<CurrenciesResponse>(httpConfig.config, 'GET', '/v1/currencies')
}
