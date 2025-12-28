# Swapped Commerce API - TypeScript SDK Build Plan

## Project Overview
Build a fully-typed TypeScript client SDK for the Swapped Commerce API that enables merchants to accept cryptocurrency payments, manage orders, handle settlements, and process payouts.

**API Base URL**: `https://pay-api.swapped.com`

**Documentation**: https://docs.swapped.com/swapped-commerce/commerce-integration

---

## Core Features to Implement

### 1. Authentication
- API Key-based authentication via `X-API-Key` header
- Support for both test and production environments
- Automatic header injection for all requests

### 2. Payment Management
- **Payment Links**: Create shareable payment links for customers
- **Payment Routes**: Direct API integration for checkout flows
- **Order Retrieval**: Query merchant orders with filtering and pagination
- **Refund Processing**: Handle payment refunds (requires matching crypto in balance)

### 3. Balance Management
- **Get Balances**: Retrieve merchant cryptocurrency balances
- **Balance Monitoring**: Track available funds for settlements and refunds

### 4. Settlement & Conversion
- **Get Quotes**: Retrieve conversion rates for crypto-to-fiat or crypto-to-crypto
- **Send Payouts**: Initiate withdrawals to bank accounts or crypto wallets
- **Settlement Tracking**: Monitor conversion and transfer status

### 5. Webhook Management
- **Order Webhooks**: Handle real-time order status updates
- **Webhook Signature Verification**: Validate webhook authenticity
- **Event Types**:
  - `ORDER_CREATED`
  - `PAYMENT_RECEIVED`
  - `ORDER_COMPLETED`
  - `SETTLEMENT_CREATED`
  - `PAYMENT_CONVERSION_SETTLED`

### 6. KYC/KYB Management
- **Get KYC Status**: Check customer verification status
- **Set KYC Data**: Submit customer verification information

---

## SDK Architecture

### Project Structure
```
swapped-commerce-sdk/
├── src/
│   ├── client/
│   │   └── SwappedCommerceClient.ts     # Main client class
│   ├── resources/
│   │   ├── orders.ts                    # Order management
│   │   ├── payments.ts                  # Payment links & routes
│   │   ├── balances.ts                  # Balance queries
│   │   ├── quotes.ts                    # Quote retrieval
│   │   ├── payouts.ts                   # Payout operations
│   │   └── kyc.ts                       # KYC management
│   ├── types/
│   │   ├── common.ts                    # Shared types
│   │   ├── orders.ts                    # Order-related types
│   │   ├── payments.ts                  # Payment types
│   │   ├── currencies.ts                # Currency & blockchain types
│   │   ├── webhooks.ts                  # Webhook event types
│   │   └── index.ts                     # Type exports
│   ├── utils/
│   │   ├── http.ts                      # HTTP client wrapper
│   │   ├── errors.ts                    # Error handling
│   │   └── webhooks.ts                  # Webhook verification
│   └── index.ts                         # Main SDK export
├── tests/
│   ├── unit/
│   └── integration/
├── examples/
│   ├── create-payment-link.ts
│   ├── handle-webhooks.ts
│   └── process-payout.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Type System Design

### Core Types

```typescript
// Configuration
interface SwappedConfig {
  apiKey: string;
  environment?: 'sandbox' | 'production';
  timeout?: number;
  retries?: number;
}

// Currencies
type CurrencyType = 'FIAT' | 'CRYPTO';
type CurrencyFlow = 'PAYMENT' | 'SETTLEMENT' | 'BOTH';

interface Currency {
  id: string;
  symbol: string;
  name: string;
  officialId: string;
  type: CurrencyType;
  precision: number;
  flows: CurrencyFlow[];
  blockchain?: Blockchain;
  blockchainId?: string;
  isStablecoin?: boolean;
  decimals?: number;
  isNative?: boolean;
}

interface Blockchain {
  id: string;
  name: string;
}

// Orders
type OrderInitType = 'STANDARD' | 'INVOICE' | 'PAYMENT_ROUTE';
type OrderStatus = 
  | 'PENDING_USER_CREATION'
  | 'PENDING_CURRENCY_SELECTION'
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_CONFIRMED_ACCURATE'
  | 'PAYMENT_CONFIRMED_UNDERPAID'
  | 'PAYMENT_CONFIRMED_OVERPAID'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELLED';

interface Order {
  id: string;
  link: string;
  externalId: string;
  userId: string;
  customerId: string;
  merchant: {
    id: string;
  };
  initType: OrderInitType;
  quote: Quote;
  depositAddress: DepositAddress;
  settlements: Settlement[];
  payments: Payment[];
  expiresAt: string;
  createdAt: string;
  status: OrderStatus;
  purchase?: Purchase;
  updates: OrderUpdate[];
  metadata: OrderMetadata;
  preferredPayCurrency?: Currency;
}

interface Quote {
  fromAmount: MoneyAmount;
  toAmount: MoneyAmount;
  exchangeRateSnapshotId: string;
  fees: Fee[];
}

interface MoneyAmount {
  amount: string;
  currency: Currency;
}

interface Fee {
  id: string;
  type: string;
  label: string;
  amount: string;
  currency: Currency;
  createdAt: string;
}

interface DepositAddress {
  id: string;
  address: string;
  available: boolean;
  memo?: string;
  supportedCurrencies: Currency[];
}

interface Settlement {
  id: string;
  type: string;
  status: string;
}

interface Payment {
  id: string;
  orderId: string;
  receivedAmount: string;
  receivedCurrency: Currency;
  txHash: string;
  confirmedAt: string;
  status: string;
  createdAt: string;
  depositAddress: DepositAddress;
  sourceAddress: string;
  fireblocksTxId?: string;
}

interface Purchase {
  id: string;
  name: string;
  notes?: string;
  imageUrl?: string;
  price: string;
  currency: Currency;
  rateMerchantOverOrder: string;
}

interface OrderUpdate {
  id: string;
  message: string;
  entityType: string;
  authorId: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

interface OrderMetadata {
  externalId?: string;
  userId?: string;
  customerId?: string;
  userName?: string;
  customerName?: string;
  userLang?: string;
  customerLang?: string;
  userCountry?: string;
  customerCountry?: string;
  userEmail?: string;
  customerEmail?: string;
  redirectUrl?: string;
}

// Pagination
interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// API Response
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Webhooks
type WebhookEventType = 
  | 'ORDER_CREATED'
  | 'PAYMENT_RECEIVED'
  | 'ORDER_COMPLETED'
  | 'SETTLEMENT_CREATED'
  | 'PAYMENT_CONVERSION_SETTLED';

interface WebhookEvent {
  event_type: WebhookEventType;
  order_id: string;
  order_status: OrderStatus;
  merchant_id: string;
  order_purchase_amount: number;
  order_purchase_currency: string;
  order_crypto?: string;
  order_crypto_amount?: number;
  network?: string;
  settlement_id?: string;
  from_amount?: number;
  from_currency?: string;
  from_network?: string;
  to_currency?: string;
}
```

---

## API Endpoints to Implement

### Orders Resource

```typescript
class OrdersResource {
  // GET /v1/merchants/orders
  list(params?: {
    page?: number;
    limit?: number;
    searchId?: string;
    startDate?: number;
    endDate?: number;
    type?: OrderInitType;
  }): Promise<ApiResponse<{
    orders: Order[];
    pagination: PaginationResponse;
  }>>;

  // GET /v1/merchants/orders/{orderId}
  get(orderId: string): Promise<ApiResponse<Order>>;

  // POST /v1/merchants/orders/{orderId}/refund
  refund(orderId: string, params: {
    amount?: string;
    reason?: string;
  }): Promise<ApiResponse<{ refundId: string }>>;
}
```

### Payments Resource

```typescript
class PaymentsResource {
  // POST /v1/merchants/payment-links
  createLink(params: {
    purchaseAmount: string;
    purchaseCurrency: string;
    purchaseName: string;
    purchaseNotes?: string;
    externalId?: string;
    customerId?: string;
    customerEmail?: string;
    redirectUrl?: string;
    expiresAt?: string;
  }): Promise<ApiResponse<{
    orderId: string;
    paymentLink: string;
  }>>;

  // POST /v1/merchants/payment-routes
  createRoute(params: {
    purchaseAmount: string;
    purchaseCurrency: string;
    preferredPayCurrency?: string;
    externalId?: string;
    customerId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ApiResponse<{
    orderId: string;
    depositAddress: DepositAddress;
    quote: Quote;
  }>>;
}
```

### Balances Resource

```typescript
class BalancesResource {
  // GET /v1/merchants/balances
  list(params?: {
    currency?: string;
    blockchain?: string;
  }): Promise<ApiResponse<{
    balances: Balance[];
  }>>;

  // GET /v1/merchants/balances/{currencyId}
  get(currencyId: string): Promise<ApiResponse<Balance>>;
}

interface Balance {
  currency: Currency;
  available: string;
  pending: string;
  total: string;
  lastUpdated: string;
}
```

### Quotes Resource

```typescript
class QuotesResource {
  // POST /v1/merchants/quotes
  get(params: {
    fromCurrency: string;
    toCurrency: string;
    amount: string;
    amountType: 'FROM' | 'TO';
  }): Promise<ApiResponse<{
    quote: Quote;
    expiresAt: string;
  }>>;
}
```

### Payouts Resource

```typescript
class PayoutsResource {
  // POST /v1/merchants/payouts
  create(params: {
    amount: string;
    currency: string;
    destinationType: 'BANK' | 'CRYPTO';
    destination: BankDestination | CryptoDestination;
    reference?: string;
  }): Promise<ApiResponse<{
    payoutId: string;
    status: string;
    estimatedArrival: string;
  }>>;

  // GET /v1/merchants/payouts
  list(params?: PaginationParams): Promise<ApiResponse<{
    payouts: Payout[];
    pagination: PaginationResponse;
  }>>;

  // GET /v1/merchants/payouts/{payoutId}
  get(payoutId: string): Promise<ApiResponse<Payout>>;
}

interface BankDestination {
  accountNumber: string;
  routingNumber?: string;
  iban?: string;
  swift?: string;
  accountHolderName: string;
}

interface CryptoDestination {
  address: string;
  blockchain: string;
  memo?: string;
}

interface Payout {
  id: string;
  amount: string;
  currency: Currency;
  destination: BankDestination | CryptoDestination;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}
```

### KYC Resource

```typescript
class KYCResource {
  // GET /v1/merchants/kyc/{customerId}
  getStatus(customerId: string): Promise<ApiResponse<{
    customerId: string;
    status: 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
    submittedAt?: string;
    reviewedAt?: string;
    rejectionReason?: string;
  }>>;

  // POST /v1/merchants/kyc
  submit(params: {
    customerId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    address: Address;
    documents: Document[];
  }): Promise<ApiResponse<{
    submissionId: string;
    status: string;
  }>>;
}

interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

interface Document {
  type: 'PASSPORT' | 'DRIVERS_LICENSE' | 'ID_CARD' | 'PROOF_OF_ADDRESS';
  frontImage: string; // Base64 or URL
  backImage?: string;
}
```

---

## Main Client Implementation

```typescript
export class SwappedCommerceClient {
  public readonly orders: OrdersResource;
  public readonly payments: PaymentsResource;
  public readonly balances: BalancesResource;
  public readonly quotes: QuotesResource;
  public readonly payouts: PayoutsResource;
  public readonly kyc: KYCResource;

  private readonly http: HttpClient;
  private readonly config: Required<SwappedConfig>;

  constructor(config: SwappedConfig) {
    this.config = {
      environment: 'production',
      timeout: 30000,
      retries: 3,
      ...config,
    };

    this.http = new HttpClient(this.config);

    this.orders = new OrdersResource(this.http);
    this.payments = new PaymentsResource(this.http);
    this.balances = new BalancesResource(this.http);
    this.quotes = new QuotesResource(this.http);
    this.payouts = new PayoutsResource(this.http);
    this.kyc = new KYCResource(this.http);
  }

  // Webhook utilities
  public verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    return verifyWebhookSignature(payload, signature, secret);
  }

  public parseWebhookEvent(payload: string): WebhookEvent {
    return JSON.parse(payload) as WebhookEvent;
  }
}
```

---

## Error Handling

```typescript
export class SwappedError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'SwappedError';
  }
}

export class SwappedAuthenticationError extends SwappedError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'SwappedAuthenticationError';
  }
}

export class SwappedValidationError extends SwappedError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'SwappedValidationError';
  }
}

export class SwappedRateLimitError extends SwappedError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'SwappedRateLimitError';
  }
}

export class SwappedNotFoundError extends SwappedError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
    this.name = 'SwappedNotFoundError';
  }
}
```

---

## HTTP Client Utilities

```typescript
class HttpClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly config: Required<SwappedConfig>;

  constructor(config: Required<SwappedConfig>) {
    this.config = config;
    this.baseUrl = 'https://pay-api.swapped.com';
    this.headers = {
      'X-API-Key': config.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const url = this.buildUrl(path, params);
    return this.request<T>('GET', url);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const url = this.buildUrl(path);
    return this.request<T>('POST', url, body);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const url = this.buildUrl(path);
    return this.request<T>('PUT', url, body);
  }

  async delete<T>(path: string): Promise<T> {
    const url = this.buildUrl(path);
    return this.request<T>('DELETE', url);
  }

  private async request<T>(
    method: string,
    url: string,
    body?: unknown
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: this.headers,
      signal: AbortSignal.timeout(this.config.timeout),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw await this.handleErrorResponse(response);
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx) except 429
        if (error instanceof SwappedError && 
            error.statusCode && 
            error.statusCode >= 400 && 
            error.statusCode < 500 &&
            error.statusCode !== 429) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.config.retries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new SwappedError('Request failed after retries');
  }

  private async handleErrorResponse(response: Response): Promise<SwappedError> {
    let errorData: { message?: string; code?: string; details?: unknown };
    
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }

    const message = errorData.message || response.statusText;

    switch (response.status) {
      case 401:
        return new SwappedAuthenticationError(message);
      case 400:
        return new SwappedValidationError(message, errorData.details);
      case 404:
        return new SwappedNotFoundError(message);
      case 429:
        return new SwappedRateLimitError(message);
      default:
        return new SwappedError(
          message,
          response.status,
          errorData.code,
          errorData.details
        );
    }
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(path, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## Webhook Verification Utility

```typescript
import { createHmac } from 'crypto';

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
}
```

---

## Testing Strategy

### Unit Tests
- Test each resource class independently
- Mock HTTP client responses
- Validate type safety and input validation
- Test error handling scenarios

### Integration Tests
- Test against Swapped sandbox environment
- Validate complete workflows:
  - Create payment link → receive payment → check order status
  - Get quote → create payout → track payout status
  - Handle webhook events → verify signatures

### Example Test Structure
```typescript
describe('OrdersResource', () => {
  let client: SwappedCommerceClient;

  beforeEach(() => {
    client = new SwappedCommerceClient({
      apiKey: 'test_key',
      environment: 'sandbox',
    });
  });

  describe('list', () => {
    it('should fetch orders with pagination', async () => {
      const response = await client.orders.list({
        page: 1,
        limit: 10,
      });

      expect(response.success).toBe(true);
      expect(response.data.orders).toBeInstanceOf(Array);
      expect(response.data.pagination).toBeDefined();
    });

    it('should filter by order type', async () => {
      const response = await client.orders.list({
        type: 'PAYMENT_ROUTE',
      });

      expect(response.data.orders.every(
        order => order.initType === 'PAYMENT_ROUTE'
      )).toBe(true);
    });
  });

  describe('refund', () => {
    it('should process a refund', async () => {
      const response = await client.orders.refund('order_123', {
        amount: '100.00',
        reason: 'Customer request',
      });

      expect(response.success).toBe(true);
      expect(response.data.refundId).toBeDefined();
    });

    it('should throw error for invalid order', async () => {
      await expect(
        client.orders.refund('invalid_order', {})
      ).rejects.toThrow(SwappedNotFoundError);
    });
  });
});
```

---

## Documentation Requirements

### README.md
- Installation instructions
- Quick start guide
- Authentication setup
- Basic usage examples
- Link to full API documentation

### API Reference
- Auto-generated from TypeScript types
- Code examples for each endpoint
- Webhook handling examples
- Error handling guide

### Example Code
```typescript
// examples/create-payment-link.ts
import { SwappedCommerceClient } from 'swapped-commerce-sdk';

const client = new SwappedCommerceClient({
  apiKey: process.env.SWAPPED_API_KEY!,
  environment: 'production',
});

async function createPaymentLink() {
  const response = await client.payments.createLink({
    purchaseAmount: '99.99',
    purchaseCurrency: 'USD',
    purchaseName: 'Premium Subscription',
    customerEmail: 'customer@example.com',
    redirectUrl: 'https://example.com/success',
  });

  console.log('Payment link:', response.data.paymentLink);
  console.log('Order ID:', response.data.orderId);
}

createPaymentLink().catch(console.error);
```

---

## Package Configuration

### package.json
```json
{
  "name": "swapped-commerce-sdk",
  "version": "1.0.0",
  "description": "Official TypeScript SDK for Swapped Commerce API",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write 'src/**/*.ts'",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "swapped",
    "commerce",
    "crypto",
    "payment",
    "gateway",
    "cryptocurrency",
    "bitcoin",
    "ethereum"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "prettier": "^3.0.0",
    "ts-jest": "^29.0.0",
    "typescript": "^5.0.0"
  },
  "files": [
    "dist"
  ],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## Development Milestones

### Phase 1: Core Infrastructure (Week 1)
- Set up project structure
- Implement HTTP client with retry logic
- Create base error classes
- Define core type system
- Write unit tests for utilities

### Phase 2: Core Resources (Week 2)
- Implement Orders resource
- Implement Payments resource (links & routes)
- Add comprehensive type definitions
- Write integration tests

### Phase 3: Additional Resources (Week 3)
- Implement Balances resource
- Implement Quotes resource
- Implement Payouts resource
- Implement KYC resource
- Add webhook verification utilities

### Phase 4: Testing & Documentation (Week 4)
- Complete test coverage (>90%)
- Write comprehensive README
- Create usage examples
- Generate API documentation
- Set up CI/CD pipeline

### Phase 5: Publishing & Maintenance
- Publish to npm
- Monitor issues and feedback
- Regular updates for API changes
- Add community contributions

---

## Success Criteria

### Functional Requirements
✅ All documented API endpoints implemented  
✅ Full TypeScript type coverage (no `any` types)  
✅ Webhook signature verification  
✅ Automatic retry with exponential backoff  
✅ Comprehensive error handling  
✅ Pagination support  

### Quality Requirements
✅ >90% test coverage  
✅ Zero linting errors  
✅ Clear, comprehensive documentation  
✅ Working code examples  
✅ Performance benchmarks  

### Developer Experience
✅ Intuitive API design  
✅ Auto-completion in IDEs  
✅ Helpful error messages  
✅ Easy debugging  
✅ Minimal dependencies  

---

## Maintenance Plan

### Versioning Strategy
- Follow Semantic Versioning (semver)
- Major version: Breaking API changes
- Minor version: New features (backward compatible)
- Patch version: Bug fixes

### Monitoring
- Track API usage patterns
- Monitor error rates
- Collect user feedback
- Stay updated with Swapped API changes

### Support Channels
- GitHub Issues for bug reports
- Discussions for questions
- Email support for enterprises
- Regular release notes

---

## Additional Considerations

### Rate Limiting
- Implement client-side rate limiting
- Respect `X-RateLimit-*` headers
- Queue requests when approaching limits

### Logging
- Optional debug logging
- Sanitize sensitive data (API keys)
- Structured log format

### Extensibility
- Plugin system for custom middleware
- Event hooks for monitoring
- Custom serializers/deserializers

### Security
- Never log API keys
- Validate all inputs
- Secure webhook signature verification
- HTTPS-only connections
