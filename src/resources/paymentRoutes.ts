import type {
  HttpConfig,
  ApiResponse,
  CreateRouteParams,
  PaymentRouteResponse,
} from '../types'
import { request } from '../utils/http'

/**
 * Create a payment route
 */
export async function createPaymentRoute(
  httpConfig: HttpConfig,
  params: Readonly<CreateRouteParams>
): Promise<ApiResponse<PaymentRouteResponse>> {
  return request<PaymentRouteResponse>(
    httpConfig.config,
    'POST',
    '/v1/merchants/payment-routes',
    {
      body: params,
    }
  )
}
