import { createClient } from './supabase/client'
import { ErrorResponse } from '../types'

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
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
    const error: ErrorResponse = await response.json()
    throw new Error(error.error?.message || 'API request failed')
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
