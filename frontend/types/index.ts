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
