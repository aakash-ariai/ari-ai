"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { tokenManager } from "@workspace/shared/lib/token-manager"

import { login, register, logout } from "../api/auth.api"
import { transformLoginResponse, transformRegisterResponse } from "../transformers/auth.transformers"
import type { LoginCredentials, RegisterData, AuthResult, RegisterResult } from "../types/auth.types"

// ============================================
// HOOKS
// ============================================

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter()

  return useMutation<AuthResult, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await login({
        email: credentials.email,
        password: credentials.password,
      })
      return transformLoginResponse(response)
    },
    onSuccess: (data) => {
      // Store tokens
      tokenManager.setTokens(
        data.accessToken,
        data.refreshToken,
        data.expiresIn
      )

      // Redirect to dashboard
      router.push("/dashboard")
    },
  })
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const router = useRouter()

  return useMutation<RegisterResult, Error, RegisterData>({
    mutationFn: async (data) => {
      const response = await register({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      })
      return transformRegisterResponse(response)
    },
    onSuccess: () => {
      // Redirect to signin after successful registration
      router.push("/signin?registered=true")
    },
  })
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const router = useRouter()

  return useMutation<void, Error>({
    mutationFn: async () => {
      await logout()
    },
    onSuccess: () => {
      tokenManager.clearTokens()
      router.push("/signin")
    },
    onError: () => {
      // Clear tokens even if logout API fails
      tokenManager.clearTokens()
      router.push("/signin")
    },
  })
}
