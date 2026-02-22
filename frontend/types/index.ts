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
