import type {
  HttpConfig,
  ApiResponse,
  Order,
  ListOrdersParams,
  OrdersResponse,
  RefundParams,
  RefundResponse,
} from '../types'
import { request } from '../utils/http'

/**
 * List orders with optional filtering and pagination
 */
export async function listOrders(
  httpConfig: HttpConfig,
  params?: Readonly<ListOrdersParams>
): Promise<ApiResponse<OrdersResponse>> {
  return request<OrdersResponse>(httpConfig.config, 'GET', '/v1/orders', {
    params,
  })
}

/**
 * Get a single order by ID
 */
export async function getOrder(
  httpConfig: HttpConfig,
  orderId: string
): Promise<ApiResponse<Order>> {
  return request<Order>(
    httpConfig.config,
    'GET',
    `/v1/orders/${encodeURIComponent(orderId)}`
  )
}

/**
 * Refund an order
 */
export async function refundOrder(
  httpConfig: HttpConfig,
  orderId: string,
  params: Readonly<RefundParams>
): Promise<ApiResponse<RefundResponse>> {
  return request<RefundResponse>(
    httpConfig.config,
    'POST',
    `/v1/merchants/orders/${encodeURIComponent(orderId)}/refund`,
    {
      body: params,
    }
  )
}
