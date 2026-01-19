"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Cookies from "js-cookie"

import type { DictionaryType } from "@/lib/get-dictionary"

import { getStatusHandler } from "@/lib/utils"

import { activateAdmin } from "../dashboards/services/apiService"
import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { NewPasswordForm } from "./new-password-form"

export function NewPassword({ dictionary }: { dictionary: DictionaryType }) {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) return

    const activate = async () => {
      try {
        const success = await activateAdmin(token)
        if (!success) {
          return
        }

        // router.push("/pages/link-expired")
      } catch (err: any) {
        getStatusHandler(err?.status, err?.message)
      }
    }

    activate()
  }, [])

  return (
    <Auth dictionary={dictionary}>
      <AuthHeader>
        <AuthTitle>New Password</AuthTitle>
        <AuthDescription>Enter your new password</AuthDescription>
      </AuthHeader>
      <AuthForm>
        <NewPasswordForm token={token} />
      </AuthForm>
    </Auth>
  )
}
