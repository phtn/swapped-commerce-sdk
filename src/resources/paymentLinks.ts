import type {
  HttpConfig,
  ApiResponse,
  CreateLinkParams,
  PaymentLinkResponse,
} from '../types'
import { request } from '../utils/http'

/**
 * Create a payment link
 */
export async function createPaymentLink(
  httpConfig: HttpConfig,
  params: Readonly<CreateLinkParams>
): Promise<ApiResponse<PaymentLinkResponse>> {
  return request<PaymentLinkResponse>(
    httpConfig.config,
    'POST',
    '/v1/orders',
    {
      body: params,
    }
  )
}
