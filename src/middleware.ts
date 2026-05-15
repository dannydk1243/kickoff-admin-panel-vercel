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
  // FIX (Bug 2): Prevent Vercel Edge from caching redirect responses.
  // Without this, a sign-in redirect gets cached on an edge node and replays
  // even after the user is authenticated.
  const response = NextResponse.redirect(redirectUrl)
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
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

  // FIX (Bug 4): Short-circuit immediately if this is the sign-in page.
  // Prevents running auth logic (and risking a redirect loop) on the sign-in
  // route itself, which is especially important on Vercel's edge network.
  if (pathnameWithoutLocale === "/sign-in") {
    return NextResponse.next()
  }

  // 2. Unified Token Retrieval
  // FIX (Bug 1): On Vercel (HTTPS), browsers send cookies with the __Secure-
  // prefix when they were set with the Secure flag. On localhost (HTTP) the
  // prefix is absent. Always check both so auth works in both environments.
  const accessToken =
    request.cookies.get("__Secure-accessToken")?.value ??
    request.cookies.get("accessToken")?.value

  const token =
    request.cookies.get("__Secure-token")?.value ??
    request.cookies.get("token")?.value

  const nextAuthToken =
    request.cookies.get("__Secure-next-auth.session-token")?.value ??
    request.cookies.get("next-auth.session-token")?.value

  const isAuthenticated = !!accessToken || !!token || !!nextAuthToken

  // 3. Handle the Root "/" Redirect
  if (pathname === "/") {
    const homePath = process.env.HOME_PATHNAME ?? "/dashboards/crm"
    const loginPath = `/${lang}/sign-in`

    const destination = isAuthenticated
      ? ensureLocalizedPathname(homePath, lang)
      : loginPath

    const response = NextResponse.redirect(new URL(destination, request.url))
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    return response
  }

  // 4. Public/Guest Logic
  const isNotPublic = !isPublicRoute(pathnameWithoutLocale)
  const isGuest = isGuestRoute(pathnameWithoutLocale)

  if (isNotPublic) {
    const adminProfileCookie = request.cookies.get("adminProfile")?.value
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
      // FIX (Bug 3): The original check used pathname.includes("/sign-in"),
      // which tests the full localized path (e.g. "/en/analytics") and never
      // matches "/sign-in". We already short-circuit on the sign-in route above
      // (Bug 4 fix), so this guard is now a reliable safety net using the
      // un-prefixed pathname.
      if (pathnameWithoutLocale !== "/sign-in") {
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

  // FIX (Bug 2, continued): Mark all pass-through responses as private/
  // non-cacheable so Vercel's edge never serves a stale authenticated response
  // to a different user or session.
  const response = NextResponse.next()
  response.headers.set("Cache-Control", "private, no-store")
  return response
}

export const config = {
  // FIX (Bug 4): Explicitly exclude the sign-in route from the matcher so
  // middleware never runs on it, regardless of locale prefix. This removes any
  // chance of a redirect loop on Vercel where edge nodes have stale state.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|docs|.*sign-in.*).*)",
  ],
}