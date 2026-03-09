import { createClient } from './supabase/client'
import { ErrorResponse } from '../types'

function getErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const errorPayload = payload as {
    error?: { message?: unknown }
    detail?: unknown
  }

  if (typeof errorPayload.error?.message === 'string') {
    return errorPayload.error.message
  }

  if (typeof errorPayload.detail === 'string') {
    return errorPayload.detail
  }

  if (Array.isArray(errorPayload.detail)) {
    const firstMessage = errorPayload.detail.find(
      (item): item is { msg?: string } =>
        Boolean(item) && typeof item === 'object' && 'msg' in item
    )
    if (typeof firstMessage?.msg === 'string') {
      return firstMessage.msg
    }
  }

  return null
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      await supabase.auth.signOut()
      window.location.href = '/login'
    }
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    let message = response.statusText || 'API request failed'
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        const text = await response.text()
        const error = JSON.parse(text) as ErrorResponse
        message = getErrorMessage(error) || message
      } catch {
        // JSON parse failed, use default message
      }
    }
    throw new Error(message)
  }

  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0' ||
    !response.headers.get('content-type')?.includes('application/json')
  ) {
    return null as T
  }

  return response.json()
}
