'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveKit } from '@/hooks/use-kit'
import { KitAnswers, BrandKit, KitStatus } from '@/types'
import { StepName } from './steps/step-name'
import { StepTagline } from './steps/step-tagline'
import { StepTone } from './steps/step-tone'
import { StepAudience } from './steps/step-audience'
import { StepColors } from './steps/step-colors'
import { StepAvoidWords } from './steps/step-avoid-words'
import { StepReview } from './steps/step-review'

interface KitWizardProps {
  brandId: string
  brandName: string
  initialKit: BrandKit
}

export function KitWizard({ brandId, brandName, initialKit }: KitWizardProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<KitAnswers>(initialKit.answers)
  const [savedSummary, setSavedSummary] = useState<string | null>(initialKit.summary)
  const [savedStatus, setSavedStatus] = useState<KitStatus>(initialKit.status)
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = useCallback((partial: Partial<KitAnswers>) => {
    setAnswers(prev => ({ ...prev, ...partial }))
    setIsDirty(true)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const saved = await saveKit(brandId, answers)
      setSavedSummary(saved.summary)
      setSavedStatus(saved.status)
      setIsDirty(false)
      router.refresh()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Screen {step + 1} of 7</p>
        <div className="h-1 bg-gray-200">
          <div className="h-1 bg-blue-600" style={{ width: `${((step + 1) / 7) * 100}%` }} />
        </div>
      </div>

      <div className="min-h-[300px]">
        {step === 0 && <StepName answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 1 && <StepTagline answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 2 && <StepTone answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 3 && <StepAudience answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 4 && <StepColors answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 5 && <StepAvoidWords answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 6 && (
          <StepReview
            answers={answers}
            onChange={handleChange}
            brandName={brandName}
            savedSummary={savedSummary}
            savedStatus={savedStatus}
            isDirty={isDirty}
            onSave={handleSave}
            saving={saving}
            saveError={saveError}
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
        {step < 6 && (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
