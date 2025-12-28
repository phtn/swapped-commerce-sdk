import type {
  SwappedConfig,
  RequiredSwappedConfig,
  HttpConfig,
  ApiResponse,
  Order,
  ListOrdersParams,
  OrdersResponse,
  RefundParams,
  RefundResponse,
  CreateLinkParams,
  PaymentLinkResponse,
  CreateRouteParams,
  PaymentRouteResponse,
  Payment,
  Balance,
  ListBalancesParams,
  BalancesResponse,
  GetQuoteParams,
  QuoteResponse,
  Payout,
  CreatePayoutParams,
  CreatePayoutResponse,
  PaginationParams,
  PayoutsResponse,
  KYCStatusResponse,
  SubmitKYCParams,
  SubmitKYCResponse,
  WebhookEvent,
} from '../types'
import * as ordersResource from '../resources/orders'
import * as paymentLinksResource from '../resources/paymentLinks'
import * as paymentRoutesResource from '../resources/paymentRoutes'
import * as paymentsResource from '../resources/payments'
import * as balancesResource from '../resources/balances'
import * as quotesResource from '../resources/quotes'
import * as payoutsResource from '../resources/payouts'
import * as kycResource from '../resources/kyc'
import { verifyWebhookSignature, parseWebhookEvent } from '../utils/webhooks'

/**
 * Swapped Commerce Client interface
 */
export interface SwappedClient {
  readonly orders: {
    readonly list: (
      params?: Readonly<ListOrdersParams>
    ) => Promise<ApiResponse<OrdersResponse>>
    readonly get: (orderId: string) => Promise<ApiResponse<Order>>
    readonly refund: (
      orderId: string,
      params: Readonly<RefundParams>
    ) => Promise<ApiResponse<RefundResponse>>
  }
  readonly paymentLinks: {
    readonly create: (
      params: Readonly<CreateLinkParams>
    ) => Promise<ApiResponse<PaymentLinkResponse>>
  }
  readonly paymentRoutes: {
    readonly create: (
      params: Readonly<CreateRouteParams>
    ) => Promise<ApiResponse<PaymentRouteResponse>>
  }
  readonly payments: {
    readonly get: (paymentId: string) => Promise<ApiResponse<Payment>>
  }
  readonly balances: {
    readonly list: (
      params?: Readonly<ListBalancesParams>
    ) => Promise<ApiResponse<BalancesResponse>>
    readonly get: (currencyId: string) => Promise<ApiResponse<Balance>>
  }
  readonly quotes: {
    readonly get: (
      params: Readonly<GetQuoteParams>
    ) => Promise<ApiResponse<QuoteResponse>>
  }
  readonly payouts: {
    readonly create: (
      params: Readonly<CreatePayoutParams>
    ) => Promise<ApiResponse<CreatePayoutResponse>>
    readonly list: (
      params?: Readonly<PaginationParams>
    ) => Promise<ApiResponse<PayoutsResponse>>
    readonly get: (payoutId: string) => Promise<ApiResponse<Payout>>
  }
  readonly kyc: {
    readonly getStatus: (
      customerId: string
    ) => Promise<ApiResponse<KYCStatusResponse>>
    readonly submit: (
      params: Readonly<SubmitKYCParams>
    ) => Promise<ApiResponse<SubmitKYCResponse>>
  }
  readonly verifyWebhookSignature: (
    payload: string,
    signature: string,
    secret: string
  ) => Promise<boolean>
  readonly parseWebhookEvent: (payload: string) => WebhookEvent
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Omit<RequiredSwappedConfig, 'apiKey'> = {
  environment: 'production',
  timeout: 30000,
  retries: 3,
}

/**
 * Base URL for Swapped Commerce API
 */
const BASE_URL = 'https://pay-api.swapped.com'

/**
 * Factory function to create a Swapped Commerce client
 * 
 * @param config - Client configuration
 * @returns Swapped Commerce client instance
 */
export function createClient(config: SwappedConfig): SwappedClient {
  const requiredConfig: RequiredSwappedConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  }

  const httpConfig: HttpConfig = {
    config: requiredConfig,
    baseUrl: BASE_URL,
  }

  return {
    orders: {
      list: (params?: Readonly<ListOrdersParams>) =>
        ordersResource.listOrders(httpConfig, params),
      get: (orderId: string) => ordersResource.getOrder(httpConfig, orderId),
      refund: (orderId: string, params: Readonly<RefundParams>) =>
        ordersResource.refundOrder(httpConfig, orderId, params),
    },
    paymentLinks: {
      create: (params: Readonly<CreateLinkParams>) =>
        paymentLinksResource.createPaymentLink(httpConfig, params),
    },
    paymentRoutes: {
      create: (params: Readonly<CreateRouteParams>) =>
        paymentRoutesResource.createPaymentRoute(httpConfig, params),
    },
    payments: {
      get: (paymentId: string) =>
        paymentsResource.getPayment(httpConfig, paymentId),
    },
    balances: {
      list: (params?: Readonly<ListBalancesParams>) =>
        balancesResource.listBalances(httpConfig, params),
      get: (currencyId: string) =>
        balancesResource.getBalance(httpConfig, currencyId),
    },
    quotes: {
      get: (params: Readonly<GetQuoteParams>) =>
        quotesResource.getQuote(httpConfig, params),
    },
    payouts: {
      create: (params: Readonly<CreatePayoutParams>) =>
        payoutsResource.createPayout(httpConfig, params),
      list: (params?: Readonly<PaginationParams>) =>
        payoutsResource.listPayouts(httpConfig, params),
      get: (payoutId: string) =>
        payoutsResource.getPayout(httpConfig, payoutId),
    },
    kyc: {
      getStatus: (customerId: string) =>
        kycResource.getKYCStatus(httpConfig, customerId),
      submit: (params: Readonly<SubmitKYCParams>) =>
        kycResource.submitKYC(httpConfig, params),
    },
    verifyWebhookSignature,
    parseWebhookEvent,
  }
}
