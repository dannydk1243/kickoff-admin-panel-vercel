"use client"
import type { DictionaryType } from "@/lib/get-dictionary"

import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { NewPasswordForm } from "./new-password-form"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { activateAdmin } from "../dashboards/services/apiService";
import { getStatusHandler } from "@/lib/utils";
import Cookies from "js-cookie";

export function NewPassword({ dictionary }: { dictionary: DictionaryType }) {

  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  const searchParams = useSearchParams();
  const token = searchParams.get("token");


  useEffect(() => {
    if (!token) return;

    const activate = async () => {
      try {
        const success = await activateAdmin(token);
        if (!success) return;

        // router.push("/pages/admins")
      } catch (err: any) {
        getStatusHandler(err?.status, err?.message);
      }
    };

    activate();
  }, []);


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
