export interface Profile {
  user_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UpdateProfileRequest {
  full_name?: string | null
  avatar_url?: string | null
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
    request_id: string
  }
}

export interface Brand {
  id: string
  name: string
  logo_url: string | null
  kit_status: string
  created_at: string
  updated_at: string
}

export interface BrandListItem {
  id: string
  name: string
  logo_url: string | null
  kit_status: string
  created_at: string
}

export interface CreateBrandRequest {
  name: string
}

export interface UpdateBrandRequest {
  name: string
}

export interface LogoUploadResponse {
  logo_url: string
}

export interface ProviderKey {
  id: string
  provider: 'openai' | 'gemini'
  label: string | null
  key_hint: string | null
  is_active: boolean
  is_valid: boolean | null
  last_validated_at: string | null
  last_validation_error: string | null
  created_at: string
}

export interface AddKeyRequest {
  provider: 'openai' | 'gemini'
  key: string
  label?: string | null
  make_active?: boolean
}

export interface ValidateKeyResponse {
  valid: boolean
  validated_at: string
  error: string | null
  key_id: string
}

export type ToneOption = 'formal' | 'casual' | 'playful' | 'professional' | 'friendly'
export type KitStatus = 'not_started' | 'in_progress' | 'complete'

export interface KitAnswers {
  tagline: string | null
  tone: ToneOption | null
  audience: string | null
  colors: string[]
  avoid_words: string | null
}

export interface BrandKit {
  brand_id: string
  brand_name: string
  answers: KitAnswers
  summary: string | null
  status: KitStatus
  completed_at: string | null
  updated_at: string | null
}

export interface UpsertKitRequest {
  answers: KitAnswers
}
