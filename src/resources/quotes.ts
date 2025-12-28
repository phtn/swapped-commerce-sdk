import type {
  HttpConfig,
  ApiResponse,
  GetQuoteParams,
  QuoteResponse,
} from '../types'
import { request } from '../utils/http'

/**
 * Get a quote for currency conversion
 */
export async function getQuote(
  httpConfig: HttpConfig,
  params: Readonly<GetQuoteParams>
): Promise<ApiResponse<QuoteResponse>> {
  return request<QuoteResponse>(
    httpConfig.config,
    'POST',
    '/v1/quotes',
    {
      body: params,
    }
  )
}
