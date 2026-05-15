import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"


import { canAccessRoute, isGuestRoute, isPublicRoute } from "@/lib/auth-routes"
import {
  ensureLocalizedPathname,
  getLocaleFromPathname,
  getPreferredLocale,
  isPathnameMissingLocale,
} from "@/lib/i18n"
import { ensureRedirectPathname, ensureWithoutPrefix } from "@/lib/utils"
import { checkIfRouteExists } from "./configs/auth-routes"

/* ✅ Define profile type */
type AdminProfile = {
  id?: string
  role?: string
  email?: string
  name?: string
}

function redirect(pathname: string, request: NextRequest) {
  const { search, hash } = request.nextUrl
  let resolvedPathname = pathname

  if (isPathnameMissingLocale(pathname)) {
    const preferredLocale = getPreferredLocale(request)
    resolvedPathname = ensureLocalizedPathname(pathname, preferredLocale)
  }

  if (search) resolvedPathname += search
  if (hash) resolvedPathname += hash

  const redirectUrl = new URL(resolvedPathname, request.url).toString()
  const response = NextResponse.redirect(redirectUrl)
  
  // CRITICAL: Prevent Vercel Edge and browsers from caching this redirect!
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('x-middleware-cache', 'no-cache') // Vercel-specific
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.set('Vary', 'Cookie')
  
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locale = getLocaleFromPathname(pathname)

  // 1. Locale enforcement (MUST happen first to normalize the path)
  if (!locale && pathname !== "/") {
    return redirect(pathname, request)
  }

  const lang = locale || "en"
  const pathnameWithoutLocale = ensureWithoutPrefix(pathname, `/${lang}`)
  
  // 2. Unified Token Retrieval
  // Fallback to __Secure- prefixed versions as recommended for Vercel production
  const accessToken = request.cookies.get("accessToken")?.value || request.cookies.get("__Secure-accessToken")?.value
  const token = request.cookies.get("token")?.value || request.cookies.get("__Secure-token")?.value
  const nextAuthToken = request.cookies.get("__Secure-next-auth.session-token")?.value || request.cookies.get("next-auth.session-token")?.value
  
  const isAuthenticated = !!accessToken || !!token || !!nextAuthToken
  
  // 3. Handle the Root "/" Redirect
  if (pathname === "/") {
    const homePath = process.env.HOME_PATHNAME ?? "/dashboards/crm"
    const loginPath = `/${lang}/sign-in`
    
    const destination = isAuthenticated 
      ? ensureLocalizedPathname(homePath, lang) 
      : loginPath

    const response = NextResponse.redirect(new URL(destination, request.url))
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('x-middleware-cache', 'no-cache')
    response.headers.set('Vary', 'Cookie')
    return response
  }

  // 4. Public/Guest Logic
  const isNotPublic = !isPublicRoute(pathnameWithoutLocale)
  const isGuest = isGuestRoute(pathnameWithoutLocale)

  if (isNotPublic) {
    const adminProfileCookie = request.cookies.get("adminProfile")?.value || request.cookies.get("__Secure-adminProfile")?.value
    let adminProfile: AdminProfile | null = null

    if (adminProfileCookie) {
      try {
        adminProfile = JSON.parse(decodeURIComponent(adminProfileCookie)) as AdminProfile
      } catch {
        adminProfile = null
      }
    }

    const isProtected = !isGuest

    // 🔐 Redirect unauthenticated users
    if (!isAuthenticated && isProtected) {
      if (!pathnameWithoutLocale.includes("/sign-in")) {
        return redirect(`/${lang}/sign-in`, request)
      }
    }

    // 🚫 Redirect authenticated users away from guest routes (like login page)
    if (isAuthenticated && isGuest) {
      return redirect(process.env.HOME_PATHNAME || "/dashboards/crm", request)
    }

    // 🛑 Role-based access control
    const role = adminProfile?.role ?? ""
    if (pathnameWithoutLocale.startsWith("/pages") || pathnameWithoutLocale.startsWith("/dashboards")) {
      const isKnownRoute = checkIfRouteExists(pathnameWithoutLocale)

      if (!isKnownRoute) {
        return redirect("/pages/not-found-404", request)
      }


      if (
        isAuthenticated &&
        !canAccessRoute(pathnameWithoutLocale, role) &&
        pathnameWithoutLocale !== "/pages/unauthorized-401" &&
        pathnameWithoutLocale !== "/pages/not-found-404"
      ) {
        return redirect("/pages/unauthorized-401", request)
      }
    }
  }

  const response = NextResponse.next()
  response.headers.set('Vary', 'Cookie')
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|sitemap.xml|robots.txt|images|docs|pages/unauthorized-401).*)",
  ],
}

