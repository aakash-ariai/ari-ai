import type {
  ApiLoginResponse,
  ApiRegisterResponse,
  AuthResult,
  RegisterResult,
  User,
} from "../types/auth.types"

// ============================================
// TRANSFORMERS
// ============================================

/**
 * Transform API user to UI user
 */
export function transformUser(apiUser: ApiLoginResponse["data"]["user"]): User {
  return {
    id: apiUser.user_id,
    email: apiUser.email,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    fullName: `${apiUser.first_name} ${apiUser.last_name}`,
    avatarUrl: apiUser.avatar_url,
    role: apiUser.role,
  }
}

/**
 * Transform API login response to UI auth result
 */
export function transformLoginResponse(response: ApiLoginResponse): AuthResult {
  return {
    user: transformUser(response.data.user),
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in,
  }
}

/**
 * Transform API register response to UI register result
 */
export function transformRegisterResponse(response: ApiRegisterResponse): RegisterResult {
  return {
    userId: response.data.user_id,
    email: response.data.email,
    firstName: response.data.first_name,
    lastName: response.data.last_name,
  }
}
