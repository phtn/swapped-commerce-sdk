import type { WebhookEvent } from '../types/webhooks'

/**
 * Pure function for verifying webhook signature using Web Crypto API
 * 
 * @param payload - Raw webhook payload string
 * @param signature - Signature from X-Signature header
 * @param secret - Webhook secret key
 * @returns Promise that resolves to true if signature is valid
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Import the secret key
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    // Sign the payload
    const payloadData = encoder.encode(payload)
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      payloadData
    )

    // Convert signature to hex string
    const signatureArray = Array.from(new Uint8Array(signatureBuffer))
    const expectedSignature = signatureArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // Compare signatures using constant-time comparison
    return constantTimeEqual(expectedSignature, signature)
  } catch {
    return false
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Pure function for parsing webhook event payload
 * 
 * @param payload - JSON string payload
 * @returns Parsed webhook event
 * @throws Error if payload is invalid JSON
 */
export function parseWebhookEvent(payload: string): WebhookEvent {
  try {
    return JSON.parse(payload) as WebhookEvent
  } catch (error) {
    throw new Error(
      `Failed to parse webhook payload: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }
}
