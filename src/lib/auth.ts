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
  let isSuccessful = false

  try {
    console.log( 'logout response', isSuccessful)

    // 1. Call your backend/external service to invalidate the session
    const response = await logoutAdmin()
    if (response) isSuccessful = true

    console.log(response, 'logout response', isSuccessful)

  } catch (error) {
    console.error("Logout API call failed:", error)
    // We usually proceed to clear cookies anyway for security
    isSuccessful = true
  }

  if (isSuccessful) {
    const cookieStore = await cookies()

    // 2. Clear cookies
    cookieStore.delete("accessToken")
    cookieStore.delete("adminProfile")

    // 3. Redirect (Perform this OUTSIDE of try/catch blocks)
    redirect(`/${lang}/sign-in`)
  }
}
