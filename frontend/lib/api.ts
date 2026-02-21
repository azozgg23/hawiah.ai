import { createClient } from './supabase/client'
import { ErrorResponse } from '../types'

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
    await supabase.auth.signOut()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    let message = 'API request failed'
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const error: ErrorResponse = await response.json()
      message = error.error?.message || message
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
