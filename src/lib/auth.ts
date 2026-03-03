"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/configs/next-auth"

import { logoutAdmin } from "@/components/auth/authService"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function authenticateUser() {
  const session = await getSession()

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized user.")
  }

  return session.user
}

export async function logout(lang: string = "en") {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  console.log("logout initiated")

  try {
    // 1. Call backend API directly to invalidate the session
    // We use fetch instead of client-side helpers to ensure server-side compatibility
    if (accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_FORM_URL}/auth/admin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_FORM_x_API_KEY || "",
          Authorization: `Bearer ${accessToken}`,
        },
      })
    }
  } catch (error) {
    console.error("Logout API call failed:", error)
    // We proceed to clear cookies anyway for security
  }

  // 2. Clear cookies
  const cookiesToClear = [
    "accessToken",
    "adminProfile",
    "next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "__Secure-next-auth.session-token",
    "__Host-next-auth.csrf-token",
  ]

  cookiesToClear.forEach((cookieName) => {
    cookieStore.set(cookieName, "", { maxAge: 0, path: "/" })
  })

  console.log("logout successful")

  return {
    success: true,
    redirectUrl: `/${lang}/sign-in`,
  }
}

