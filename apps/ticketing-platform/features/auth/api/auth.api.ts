import { getApiClient } from "@workspace/shared/lib/api-client"
import type {
  ApiLoginRequest,
  ApiLoginResponse,
  ApiRegisterRequest,
  ApiRegisterResponse,
} from "../types/auth.types"

// ============================================
// CONFIGURATION
// Set to false when backend API is ready
// ============================================
const USE_MOCK_DATA = true

// ============================================
// MOCK HELPERS
// ============================================
async function simulateNetworkDelay(ms: number = 1000): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

// Mock user database
const MOCK_USERS = [
  {
    user_id: "usr_001",
    email: "demo@example.com",
    password: "password123",
    first_name: "Demo",
    last_name: "User",
    avatar_url: null,
    role: "admin",
  },
]

// ============================================
// API FUNCTIONS
// ============================================

export async function login(credentials: ApiLoginRequest): Promise<ApiLoginResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()

    const user = MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    )

    if (!user) {
      throw new Error("Invalid email or password")
    }

    return {
      statusCode: 200,
      data: {
        access_token: `mock_access_token_${Date.now()}`,
        refresh_token: `mock_refresh_token_${Date.now()}`,
        expires_in: 3600,
        user: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar_url: user.avatar_url,
          role: user.role,
        },
      },
      message: "Login successful",
    }
  }

  const client = getApiClient()
  return client.post<ApiLoginResponse>("/auth/login", credentials)
}

export async function register(data: ApiRegisterRequest): Promise<ApiRegisterResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()

    const existingUser = MOCK_USERS.find((u) => u.email === data.email)
    if (existingUser) {
      throw new Error("Email already registered")
    }

    return {
      statusCode: 201,
      data: {
        user_id: `usr_${Date.now()}`,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      },
      message: "Registration successful",
    }
  }

  const client = getApiClient()
  return client.post<ApiRegisterResponse>("/auth/register", data)
}

export async function logout(): Promise<void> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay(500)
    return
  }

  const client = getApiClient()
  await client.post("/auth/logout")
}
