'use client'

import { useState } from 'react'
import { apiRequest } from '@/lib/api'
import type { GenerateRequest, GenerationResponse } from '@/types'

export type GenerateState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; result: GenerationResponse }
  | { status: 'error'; code: string; message: string }

interface UseGenerateResult {
  state: GenerateState
  generate: (body: GenerateRequest) => Promise<void>
  reset: () => void
}

export function useGenerate(brandId: string): UseGenerateResult {
  const [state, setState] = useState<GenerateState>({ status: 'idle' })

  async function generate(body: GenerateRequest) {
    setState({ status: 'submitting' })
    try {
      const result = await apiRequest<GenerationResponse>(
        `/brands/${brandId}/generate`,
        { method: 'POST', body: JSON.stringify(body) },
      )
      setState({ status: 'success', result })
    } catch (err) {
      let code = (err as { code?: string }).code
      if (!code && err instanceof Error) {
        const match = err.message.match(/\b([A-Z][A-Z0-9_]{1,})\b/)
        if (match) code = match[1]
      }
      code = code ?? 'UNKNOWN'
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setState({ status: 'error', code, message })
    }
  }

  function reset() {
    setState({ status: 'idle' })
  }

  return { state, generate, reset }
}
