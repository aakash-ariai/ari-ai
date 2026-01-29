type TokenType = "access" | "refresh"

interface CookieOptions {
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
}

const TOKEN_KEYS: Record<TokenType, string> = {
  access: "app_access_token",
  refresh: "app_refresh_token",
}

function isSecureContext(): boolean {
  if (typeof window === "undefined") return false
  return window.location.protocol === "https:"
}

function getDefaultCookieOptions(): CookieOptions {
  return {
    path: "/",
    secure: isSecureContext(),
    sameSite: "lax",
  }
}

class TokenManager {
  private static instance: TokenManager | null = null

  private constructor() {}

  static getInstance(): TokenManager {
    if (typeof window === "undefined") {
      return new TokenManager()
    }

    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  private setCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    if (typeof document === "undefined") return

    const mergedOptions = { ...getDefaultCookieOptions(), ...options }
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (mergedOptions.expires) {
      cookieString += `; expires=${mergedOptions.expires.toUTCString()}`
    }

    if (mergedOptions.path) {
      cookieString += `; path=${mergedOptions.path}`
    }

    if (mergedOptions.domain) {
      cookieString += `; domain=${mergedOptions.domain}`
    }

    if (mergedOptions.secure) {
      cookieString += "; secure"
    }

    if (mergedOptions.sameSite) {
      cookieString += `; samesite=${mergedOptions.sameSite}`
    }

    document.cookie = cookieString
  }

  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null

    const cookies = document.cookie.split("; ")
    const cookie = cookies.find((c) => c.startsWith(`${encodeURIComponent(name)}=`))

    if (!cookie) return null

    return decodeURIComponent(cookie.split("=")[1] ?? "")
  }

  private deleteCookie(name: string): void {
    if (typeof document === "undefined") return

    document.cookie = `${encodeURIComponent(name)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }

  setAccessToken(token: string, _expiresInSeconds?: number): void {
    this.setCookie(TOKEN_KEYS.access, token, {})
  }

  getAccessToken(): string | null {
    return this.getCookie(TOKEN_KEYS.access)
  }

  setRefreshToken(token: string, expiresInSeconds?: number): void {
    const options: CookieOptions = {}

    if (expiresInSeconds) {
      options.expires = new Date(Date.now() + expiresInSeconds * 1000)
    }

    this.setCookie(TOKEN_KEYS.refresh, token, options)
  }

  getRefreshToken(): string | null {
    return this.getCookie(TOKEN_KEYS.refresh)
  }

  setTokens(
    accessToken: string,
    refreshToken: string,
    accessExpiresIn?: number,
    refreshExpiresIn?: number
  ): void {
    this.setAccessToken(accessToken, accessExpiresIn)
    this.setRefreshToken(refreshToken, refreshExpiresIn)
  }

  clearTokens(): void {
    this.deleteCookie(TOKEN_KEYS.access)
    this.deleteCookie(TOKEN_KEYS.refresh)
  }

  hasValidTokens(): boolean {
    return !!this.getAccessToken()
  }
}

export const tokenManager = TokenManager.getInstance()
export type { TokenType, CookieOptions }
