// ============================================
// API TYPES (match backend response)
// ============================================
export interface ApiLoginRequest {
  email: string
  password: string
}

export interface ApiLoginResponse {
  statusCode: number
  data: {
    access_token: string
    refresh_token: string
    expires_in: number
    user: {
      user_id: string
      email: string
      first_name: string
      last_name: string
      avatar_url: string | null
      role: string
    }
  }
  message: string
}

export interface ApiRegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface ApiRegisterResponse {
  statusCode: number
  data: {
    user_id: string
    email: string
    first_name: string
    last_name: string
  }
  message: string
}

// ============================================
// UI TYPES (what components consume)
// ============================================
export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatarUrl: string | null
  role: string
}

export interface AuthResult {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface RegisterResult {
  userId: string
  email: string
  firstName: string
  lastName: string
}
