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
  const isNotPublic = !isPublicRoute(pathnameWithoutLocale)

  if (isNotPublic) {
    const accessToken = request.cookies.get("accessToken")?.value
    const adminProfileCookie = request.cookies.get("adminProfile")?.value

    /* ✅ Parse profile safely */
    let adminProfile: AdminProfile | null = null

    if (adminProfileCookie) {
      try {
        adminProfile = JSON.parse(adminProfileCookie) as AdminProfile
      } catch {
        adminProfile = null
      }
    }

    const isAuthenticated = !!accessToken
    const isGuest = isGuestRoute(pathnameWithoutLocale)
    const isProtected = !isGuest

    // 🔐 Redirect unauthenticated users
    if (!isAuthenticated && isProtected) {
      let redirectPathname = "/sign-in"

      if (pathnameWithoutLocale !== "") {
        redirectPathname = ensureRedirectPathname(redirectPathname, pathname)
      }

      return redirect(redirectPathname, request)
    }

    // 🚫 Redirect authenticated users away from guest routes
    if (isAuthenticated && isGuest) {
      return redirect(process.env.HOME_PATHNAME || "/", request)
    }

    /* ✅ FIXED: role access (NO TS ERROR) */
    const role = adminProfile?.role ?? ""



    // 🛑 Role-based access control
    if (
      isAuthenticated &&
      !canAccessRoute(pathnameWithoutLocale, role) &&
      pathnameWithoutLocale !== "/pages/unauthorized-401"
    ) {
      return redirect("/pages/unauthorized-401", request)
    }
  }

  // 🌍 Locale enforcement
  if (!locale) {
    return redirect(pathname, request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|docs|pages/unauthorized-401).*)",
  ],
}
