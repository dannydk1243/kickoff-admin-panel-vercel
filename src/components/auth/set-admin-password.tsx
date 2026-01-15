"use client"
import type { DictionaryType } from "@/lib/get-dictionary"

import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { VerifyEmailForm } from "./verify-email-form"
import { NewPasswordForm } from "./new-password-form"
import { useSearchParams } from "next/navigation";

export function SetAdminPassword({ dictionary }: { dictionary: DictionaryType }) {

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  return (
    <Auth dictionary={dictionary}>
      <AuthHeader>
        <AuthTitle>Set Password</AuthTitle>
        <AuthDescription>Enter your new password</AuthDescription>
      </AuthHeader>
      <AuthForm>
        <NewPasswordForm token={token} />
      </AuthForm>
    </Auth>
  )
}
