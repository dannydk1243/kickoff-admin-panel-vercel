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
  return NextResponse.redirect(redirectUrl)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locale = getLocaleFromPathname(pathname)
  const pathnameWithoutLocale = ensureWithoutPrefix(pathname, `/${locale}`)
  
  // 1. Unified Token Retrieval
  // Using 'accessToken' as the primary source of truth since your role check depends on it
  const accessToken = request.cookies.get("accessToken")?.value
  const token = request.cookies.get("token")?.value
  const isAuthenticated = !!accessToken || !!token 
  
  const lang = locale || getPreferredLocale(request) || "en"

  // 2. Handle the Root "/" Redirect
  if (pathname === "/") {
    const homePath = process.env.HOME_PATHNAME ?? "/pages/courts"
    const loginPath = `/${lang}/sign-in`
    
    // Ensure the homePath has a locale prefix so it doesn't trigger "missing locale" redirect later
    const destination = isAuthenticated 
      ? ensureLocalizedPathname(homePath, lang) 
      : loginPath

    return NextResponse.redirect(new URL(destination, request.url))
  }

  // 3. Public/Guest Logic
  const isNotPublic = !isPublicRoute(pathnameWithoutLocale)
  const isGuest = isGuestRoute(pathnameWithoutLocale)

  if (isNotPublic) {
    const adminProfileCookie = request.cookies.get("adminProfile")?.value
    let adminProfile: AdminProfile | null = null

    if (adminProfileCookie) {
      try {
        // Decode URI component in case Vercel encoded the cookie string
        adminProfile = JSON.parse(decodeURIComponent(adminProfileCookie)) as AdminProfile
      } catch {
        adminProfile = null
      }
    }

    const isProtected = !isGuest

    // 🔐 Redirect unauthenticated users
    if (!isAuthenticated && isProtected) {
      // Avoid redirecting if already on login
      if (!pathname.includes("/sign-in")) {
        return redirect("/en/sign-in", request) // Use your login path
      }
    }

    // 🚫 Redirect authenticated users away from guest routes (like login page)
    if (isAuthenticated && isGuest) {
      return redirect(process.env.HOME_PATHNAME || "/pages/courts", request)
    }

    // 🛑 Role-based access control
    const role = adminProfile?.role ?? ""
    if (pathnameWithoutLocale.startsWith('/pages')) {
  
  // Logic to determine if the route is "known"
  // If canAccessRoute (or a new helper) returns false because the route isn't found
  const isKnownRoute = checkIfRouteExists(pathnameWithoutLocale); 

  if (!isKnownRoute) {
    return redirect("/pages/not-found-404", request);
  }

  // 2. Existing Role-based access control
  if (
    isAuthenticated &&
    !canAccessRoute(pathnameWithoutLocale, role) &&
    pathnameWithoutLocale !== "/pages/unauthorized-401" &&
    pathnameWithoutLocale !== "/pages/not-found-404"
  ) {
    return redirect("/pages/unauthorized-401", request);
  }
}
  }

  // 🌍 Locale enforcement (Move to end)
  if (!locale && pathname !== '/') {
    return redirect(pathname, request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|docs|pages/unauthorized-401).*)",
  ],
}
