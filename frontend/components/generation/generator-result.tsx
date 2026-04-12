'use client'

import { useState } from 'react'
import type { GenerationResponse } from '@/types'
import { ErrorMessage } from '@/components/generation/error-message'

interface GeneratorResultProps {
  state:
    | { status: 'idle' }
    | { status: 'submitting' }
    | { status: 'success'; result: GenerationResponse }
    | { status: 'error'; code: string; message: string }
  brandId: string
}

export function GeneratorResult({ state, brandId }: GeneratorResultProps) {
  const [downloading, setDownloading] = useState(false)

  async function handleDownload(result: GenerationResponse) {
    if (!result.image_url || !result.download_filename) return
    setDownloading(true)
    try {
      const response = await fetch(result.image_url)
      if (!response.ok) throw new Error('Failed to fetch image')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.download_filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  if (state.status === 'idle') {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Your generated image will appear here.
      </div>
    )
  }

  if (state.status === 'submitting') {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Generating…
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <ErrorMessage code={state.code} message={state.message} brandId={brandId} />
    )
  }

  const { result } = state
  return (
    <div className="flex flex-col gap-3">
      {result.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={result.image_url}
          alt="Generated"
          className="w-full rounded-md border"
        />
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {result.width} × {result.height} · {result.provider} · {result.model}
        </span>
        <button
          type="button"
          onClick={() => handleDownload(result)}
          disabled={downloading || !result.image_url}
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {downloading ? 'Downloading…' : 'Download'}
        </button>
      </div>
    </div>
  )
}
