'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { BrandListItem } from '@/types'

export function useBrands() {
  const [brands, setBrands] = useState<BrandListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiRequest<BrandListItem[]>('/brands')
      setBrands(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load brands')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  const mutate = useCallback((updatedBrands: BrandListItem[]) => {
    setBrands(updatedBrands)
  }, [])

  return { brands, loading, error, mutate, refetch: fetchBrands }
}
