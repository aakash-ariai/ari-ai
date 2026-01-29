import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ACCESS_TOKEN_KEY = "app_access_token"

const PUBLIC_ROUTES = [
  "/signin",
  "/signup",
]

const AUTH_ROUTES = [
  "/signin",
  "/signup",
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

function isRSCRequest(request: NextRequest): boolean {
  if (request.headers.get("RSC") === "1") return true
  if (request.headers.get("Next-Router-State-Tree")) return true
  if (request.nextUrl.searchParams.has("_rsc")) return true
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value

  if (pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  if (isPublicRoute(pathname)) {
    if (accessToken && isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  if (!accessToken) {
    if (isRSCRequest(request)) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized", redirect: "/signin" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const signinUrl = new URL("/signin", request.url)
    signinUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signinUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
}
