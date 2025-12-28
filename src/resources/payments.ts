import type {
  HttpConfig,
  ApiResponse,
  Payment,
} from '../types'
import { request } from '../utils/http'

/**
 * Get payment information by ID
 */
export async function getPayment(
  httpConfig: HttpConfig,
  paymentId: string
): Promise<ApiResponse<Payment>> {
  return request<Payment>(
    httpConfig.config,
    'GET',
    `/v1/merchants/payments/${encodeURIComponent(paymentId)}`
  )
}
