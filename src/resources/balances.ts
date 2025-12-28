import type {
  HttpConfig,
  ApiResponse,
  Balance,
  ListBalancesParams,
  BalancesResponse,
} from '../types'
import { request } from '../utils/http'

/**
 * List balances with optional filtering
 */
export async function listBalances(
  httpConfig: HttpConfig,
  params?: Readonly<ListBalancesParams>
): Promise<ApiResponse<BalancesResponse>> {
  return request<BalancesResponse>(
    httpConfig.config,
    'GET',
    '/v1/balances',
    {
      params,
    }
  )
}

/**
 * Get balance for a specific currency
 */
export async function getBalance(
  httpConfig: HttpConfig,
  currencyId: string
): Promise<ApiResponse<Balance>> {
  return request<Balance>(
    httpConfig.config,
    'GET',
    `/v1/balances/${encodeURIComponent(currencyId)}`
  )
}
