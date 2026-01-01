import type {
  HttpConfig,
  ApiResponse,
  GetQuoteParams,
  QuoteResponse,
} from '../types'
import { request } from '../utils/http'

/**
 * Get a quote for currency conversion
 *
 * @example
 * ```typescript
 * const response = await client.quotes.get({
 *   fromAmount: 25,
 *   fromFiatCurrency: 'EUR',
 *   toCurrency: 'TRX',
 *   toBlockchain: 'tron',
 * })
 *
 * console.log(response.data.toAmount.afterFees) // "103.802"
 * ```
 */
export async function getQuote(
  httpConfig: HttpConfig,
  params: Readonly<GetQuoteParams>
): Promise<ApiResponse<QuoteResponse>> {
  return request<QuoteResponse>(httpConfig.config, 'GET', '/v1/quotes', {
    params: {
      fromAmount: String(params.fromAmount),
      fromFiatCurrency: params.fromFiatCurrency,
      toCurrency: params.toCurrency,
      toBlockchain: params.toBlockchain,
    },
  })
}
