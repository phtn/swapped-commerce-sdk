import type {
  HttpConfig,
  ApiResponse,
  KYCStatusResponse,
  SubmitKYCParams,
  SubmitKYCResponse,
} from '../types'
import { request } from '../utils/http'

/**
 * Get KYC status for a customer
 */
export async function getKYCStatus(
  httpConfig: HttpConfig,
  customerId: string
): Promise<ApiResponse<KYCStatusResponse>> {
  return request<KYCStatusResponse>(
    httpConfig.config,
    'GET',
    `/v1/kyc/${encodeURIComponent(customerId)}`
  )
}

/**
 * Submit KYC information for a customer
 */
export async function submitKYC(
  httpConfig: HttpConfig,
  params: Readonly<SubmitKYCParams>
): Promise<ApiResponse<SubmitKYCResponse>> {
  return request<SubmitKYCResponse>(
    httpConfig.config,
    'POST',
    '/v1/kyc',
    {
      body: params,
    }
  )
}
