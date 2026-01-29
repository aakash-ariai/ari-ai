import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"

import { tokenManager } from "./token-manager"

interface ApiClientConfig {
  baseURL: string
  timeout?: number
  signInUrl?: string
}

interface RefreshTokenData {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

interface RefreshTokenResponse {
  statusCode: number
  data: RefreshTokenData
  message: string
}

class ApiClient {
  private static instance: ApiClient
  private axiosInstance: AxiosInstance
  private isRefreshing: boolean = false
  private refreshSubscribers: Array<(token: string) => void> = []
  private signInUrl: string

  private constructor(config: ApiClientConfig) {
    this.signInUrl = config.signInUrl || "/signin"
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  static getInstance(config?: ApiClientConfig): ApiClient {
    if (!ApiClient.instance) {
      if (!config) {
        throw new Error("ApiClient must be initialized with config on first call")
      }
      ApiClient.instance = new ApiClient(config)
    }
    return ApiClient.instance
  }

  static initialize(config: ApiClientConfig): ApiClient {
    if (ApiClient.instance) {
      console.warn("ApiClient already initialized. Returning existing instance.")
      return ApiClient.instance
    }
    ApiClient.instance = new ApiClient(config)
    return ApiClient.instance
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getAccessToken()

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean
        }

        const isUnauthorized = error.response?.status === 401 || error.response?.status === 403
        const requestUrl = originalRequest.url || ""
        const isLogoutRequest = requestUrl.includes("/auth/logout")

        const authEndpoints = [
          "/auth/login",
          "/auth/register",
          "/auth/verify",
          "/auth/set-password",
          "/auth/refresh",
          "/auth/initiate",
        ]
        const isAuthRequest = authEndpoints.some((endpoint) => requestUrl.includes(endpoint))

        if (isUnauthorized && !originalRequest._retry && !isLogoutRequest && !isAuthRequest && requestUrl) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.refreshSubscribers.push((token: string) => {
                if (token) {
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                  }
                  resolve(this.axiosInstance(originalRequest))
                } else {
                  reject(error)
                }
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const newToken = await this.refreshToken()

            if (newToken) {
              this.onRefreshSuccess(newToken)

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
              }

              return this.axiosInstance(originalRequest)
            } else {
              return Promise.reject(new Error("Session expired. Please login again."))
            }
          } catch (refreshError) {
            await this.onRefreshFailure()
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = tokenManager.getRefreshToken()

    if (!refreshToken) {
      await this.onRefreshFailure()
      return null
    }

    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${this.axiosInstance.defaults.baseURL}/auth/refresh`,
        { refreshToken }
      )

      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data

      tokenManager.setAccessToken(accessToken, expiresIn)

      if (newRefreshToken) {
        tokenManager.setRefreshToken(newRefreshToken)
      }

      return accessToken
    } catch {
      await this.onRefreshFailure()
      return null
    }
  }

  private onRefreshSuccess(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  private async onRefreshFailure(): Promise<void> {
    this.refreshSubscribers = []

    try {
      const token = tokenManager.getAccessToken()
      await axios.post(
        `${this.axiosInstance.defaults.baseURL}/auth/logout`,
        undefined,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )
    } catch {
      // Ignore errors - we're logging out anyway
    }

    tokenManager.clearTokens()

    if (typeof window !== "undefined") {
      window.location.href = this.signInUrl
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config)
    return response.data
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config)
    return response.data
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config)
    return response.data
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

export const initializeApiClient = (config: ApiClientConfig): ApiClient => {
  return ApiClient.initialize(config)
}

export const getApiClient = (): ApiClient => {
  return ApiClient.getInstance()
}

export function getErrorMessage(error: unknown, fallback: string = "An error occurred"): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallback
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  return fallback
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    return status === 401 || status === 403
  }
  return false
}

export type { ApiClientConfig, RefreshTokenResponse }
