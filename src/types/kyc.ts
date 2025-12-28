/**
 * KYC status
 */
export type KYCStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED'

/**
 * Address information
 */
export interface Address {
  readonly street: string
  readonly city: string
  readonly state?: string
  readonly postalCode: string
  readonly country: string
}

/**
 * Document type
 */
export type DocumentType =
  | 'PASSPORT'
  | 'DRIVERS_LICENSE'
  | 'ID_CARD'
  | 'PROOF_OF_ADDRESS'

/**
 * Document information
 */
export interface Document {
  readonly type: DocumentType
  readonly frontImage: string // Base64 or URL
  readonly backImage?: string
}

/**
 * Response for KYC status
 */
export interface KYCStatusResponse {
  readonly customerId: string
  readonly status: KYCStatus
  readonly submittedAt?: string
  readonly reviewedAt?: string
  readonly rejectionReason?: string
}

/**
 * Parameters for submitting KYC
 */
export interface SubmitKYCParams {
  readonly customerId: string
  readonly firstName: string
  readonly lastName: string
  readonly dateOfBirth: string
  readonly nationality: string
  readonly address: Address
  readonly documents: readonly Document[]
}

/**
 * Response for submitting KYC
 */
export interface SubmitKYCResponse {
  readonly submissionId: string
  readonly status: string
}
