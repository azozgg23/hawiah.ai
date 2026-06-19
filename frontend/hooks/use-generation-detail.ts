'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiRequest, ApiError } from '@/lib/api'
import type { GenerationDetail } from '@/types'

interface UseGenerationDetailResult {
  detail: GenerationDetail | null
  loading: boolean
  error: string | null
  notFound: boolean
}

export function useGenerationDetail(brandId: string, generationId: string): UseGenerationDetailResult {
  const [detail, setDetail] = useState<GenerationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setNotFound(false)
      const data = await apiRequest<GenerationDetail>(
        `/brands/${brandId}/generations/${generationId}`,
      )
      setDetail(data)
    } catch (err) {
      if (err instanceof ApiError && err.code === 'GENERATION_NOT_FOUND') {
        setNotFound(true)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load generation')
      }
    } finally {
      setLoading(false)
    }
  }, [brandId, generationId])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return { detail, loading, error, notFound }
}
