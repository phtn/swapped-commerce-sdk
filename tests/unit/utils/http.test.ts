import { test, expect, mock } from 'bun:test'
import { buildUrl, createRequestConfig } from '../../../src/utils/http'
import type { RequiredSwappedConfig } from '../../../src/types/common'

test('buildUrl creates correct URL without params', () => {
  const url = buildUrl('https://api.example.com', '/v1/test')
  expect(url).toBe('https://api.example.com/v1/test')
})

test('buildUrl adds query parameters', () => {
  const url = buildUrl('https://api.example.com', '/v1/test', {
    page: 1,
    limit: 10,
    search: 'test query',
  })

  const parsedUrl = new URL(url)
  expect(parsedUrl.searchParams.get('page')).toBe('1')
  expect(parsedUrl.searchParams.get('limit')).toBe('10')
  expect(parsedUrl.searchParams.get('search')).toBe('test query')
})

test('buildUrl ignores undefined and null params', () => {
  const url = buildUrl('https://api.example.com', '/v1/test', {
    page: 1,
    limit: undefined,
    search: null,
  })

  const parsedUrl = new URL(url)
  expect(parsedUrl.searchParams.get('page')).toBe('1')
  expect(parsedUrl.searchParams.has('limit')).toBe(false)
  expect(parsedUrl.searchParams.has('search')).toBe(false)
})

test('createRequestConfig creates GET request without body', () => {
  const config: RequiredSwappedConfig = {
    apiKey: 'test-key',
    environment: 'production',
    timeout: 30000,
    retries: 3,
  }

  const requestConfig = createRequestConfig(config, 'GET', '/v1/test')

  expect(requestConfig.method).toBe('GET')
  expect(requestConfig.body).toBeUndefined()
  expect(requestConfig.headers).toBeDefined()
  expect((requestConfig.headers as Record<string, string>)['X-API-Key']).toBe('test-key')
})

test('createRequestConfig creates POST request with body', () => {
  const config: RequiredSwappedConfig = {
    apiKey: 'test-key',
    environment: 'production',
    timeout: 30000,
    retries: 3,
  }

  const body = { test: 'data' }
  const requestConfig = createRequestConfig(config, 'POST', '/v1/test', body)

  expect(requestConfig.method).toBe('POST')
  expect(requestConfig.body).toBe(JSON.stringify(body))
  expect((requestConfig.headers as Record<string, string>)['Content-Type']).toBe(
    'application/json'
  )
})

test('createRequestConfig sets correct headers', () => {
  const config: RequiredSwappedConfig = {
    apiKey: 'test-api-key',
    environment: 'production',
    timeout: 30000,
    retries: 3,
  }

  const requestConfig = createRequestConfig(config, 'GET', '/v1/test')
  const headers = requestConfig.headers as Record<string, string>

  expect(headers['X-API-Key']).toBe('test-api-key')
  expect(headers['Content-Type']).toBe('application/json')
  expect(headers['Accept']).toBe('application/json')
})
