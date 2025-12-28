#!/usr/bin/env bun

/**
 * Performance Benchmark Runner
 * 
 * Runs performance benchmarks and displays formatted results
 */

import { buildUrl, createRequestConfig } from '../src/utils/http'
import { verifyWebhookSignature } from '../src/utils/webhooks'
import type { RequiredSwappedConfig } from '../src/types/common'

const config: RequiredSwappedConfig = {
  apiKey: 'test-key',
  environment: 'production',
  timeout: 30000,
  retries: 3,
}

interface BenchmarkResult {
  name: string
  opsPerSecond: number
  duration: number
  iterations: number
}

const results: BenchmarkResult[] = []

console.log('Swapped Commerce SDK - Performance Benchmarks\n')
console.log('=' .repeat(60))

// URL Building Benchmark
async function benchmarkUrlBuilding() {
  const iterations = 10000
  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    buildUrl('https://api.example.com', '/v1/test', {
      page: i,
      limit: 10,
      search: `query-${i}`,
    })
  }

  const end = performance.now()
  const duration = end - start
  const opsPerSecond = (iterations / duration) * 1000

  results.push({
    name: 'URL Building',
    opsPerSecond,
    duration,
    iterations,
  })
}

// Request Config Benchmark
async function benchmarkRequestConfig() {
  const iterations = 10000
  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    createRequestConfig(config, 'POST', '/v1/test', { data: `test-${i}` })
  }

  const end = performance.now()
  const duration = end - start
  const opsPerSecond = (iterations / duration) * 1000

  results.push({
    name: 'Request Config Creation',
    opsPerSecond,
    duration,
    iterations,
  })
}

// Webhook Verification Benchmark
async function benchmarkWebhookVerification() {
  const iterations = 100
  const payload = '{"event_type":"ORDER_CREATED","order_id":"test"}'
  const secret = 'test-secret-key'

  // Generate a valid signature
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const signatureArray = Array.from(new Uint8Array(signatureBuffer))
  const signature = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    await verifyWebhookSignature(payload, signature, secret)
  }

  const end = performance.now()
  const duration = end - start
  const opsPerSecond = (iterations / duration) * 1000

  results.push({
    name: 'Webhook Signature Verification',
    opsPerSecond,
    duration,
    iterations,
  })
}

// Type Safety Overhead Benchmark
async function benchmarkTypeSafety() {
  const iterations = 100000
  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    const testObj: Readonly<{ id: string; value: number }> = {
      id: `test-${i}`,
      value: i,
    }
    void testObj.id
    void testObj.value
  }

  const end = performance.now()
  const duration = end - start
  const opsPerSecond = (iterations / duration) * 1000

  results.push({
    name: 'Type Safety Overhead',
    opsPerSecond,
    duration,
    iterations,
  })
}

// Run all benchmarks
async function runBenchmarks() {
  console.log('\nRunning benchmarks...\n')

  await benchmarkUrlBuilding()
  await benchmarkRequestConfig()
  await benchmarkWebhookVerification()
  await benchmarkTypeSafety()

  // Display results
  console.log('\nBenchmark Results:\n')
  console.log('┌─────────────────────────────────────┬──────────────┬─────────────┐')
  console.log('│ Operation                            │ Ops/Second    │ Duration    │')
  console.log('├─────────────────────────────────────┼──────────────┼─────────────┤')

  for (const result of results) {
    const name = result.name.padEnd(39)
    const ops = result.opsPerSecond.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    }).padStart(12)
    const duration = `${result.duration.toFixed(2)}ms`.padStart(11)
    console.log(`│ ${name} │ ${ops} │ ${duration} │`)
  }

  console.log('└─────────────────────────────────────┴──────────────┴─────────────┘')

  // Summary
  console.log('\nSummary:')
  console.log(`   • Total benchmarks: ${results.length}`)
  console.log(`   • Average performance: ${(results.reduce((sum, r) => sum + r.opsPerSecond, 0) / results.length).toLocaleString('en-US', { maximumFractionDigits: 0 })} ops/sec`)
  console.log(`   • Fastest operation: ${results.reduce((max, r) => r.opsPerSecond > max.opsPerSecond ? r : max).name}`)
  console.log(`   • Slowest operation: ${results.reduce((min, r) => r.opsPerSecond < min.opsPerSecond ? r : min).name}`)
  console.log('\n')
}

runBenchmarks().catch(console.error)
