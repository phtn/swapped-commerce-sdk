import type {
  HttpConfig,
  ApiResponse,
  Payout,
  CreatePayoutParams,
  CreatePayoutResponse,
  PaginationParams,
  PayoutsResponse,
} from '../types'
import { request } from '../utils/http'

/**
 * Create a payout
 */
export async function createPayout(
  httpConfig: HttpConfig,
  params: Readonly<CreatePayoutParams>
): Promise<ApiResponse<CreatePayoutResponse>> {
  return request<CreatePayoutResponse>(
    httpConfig.config,
    'POST',
    '/v1/merchants/payouts',
    {
      body: params,
    }
  )
}

/**
 * List payouts with pagination
 */
export async function listPayouts(
  httpConfig: HttpConfig,
  params?: Readonly<PaginationParams>
): Promise<ApiResponse<PayoutsResponse>> {
  return request<PayoutsResponse>(
    httpConfig.config,
    'GET',
    '/v1/merchants/payouts',
    {
      params,
    }
  )
}

/**
 * Get a single payout by ID
 */
export async function getPayout(
  httpConfig: HttpConfig,
  payoutId: string
): Promise<ApiResponse<Payout>> {
  return request<Payout>(
    httpConfig.config,
    'GET',
    `/v1/merchants/payouts/${encodeURIComponent(payoutId)}`
  )
}
