"use client"

import Link from "next/link"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { LocaleType, NewPasswordFormType } from "@/types"

import { NewPasswordSchema } from "@/schemas/new-passward-schema"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { ensureRedirectPathname, getStatusHandler } from "@/lib/utils"

import { toast } from "@/hooks/use-toast"
import { ButtonLoading } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { resetPasswordAdmin } from "./authService"
import { useEffect } from "react"
import Cookies from "js-cookie"

export function NewPasswordForm({ token }: { token: string | null }) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<NewPasswordFormType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const locale = params.lang as LocaleType
  const redirectPathname = searchParams.get("redirectTo")
  const { isSubmitting, isDirty } = form.formState
  const isDisabled = isSubmitting || !isDirty // Disable button if form is unchanged or submitting
  const pathname = usePathname()
  const activationToken = Cookies.get("adminActivationToken");

  // const redirectPathname =
  //   searchParams.get("redirectTo") ||
  //   process.env.NEXT_PUBLIC_HOME_PATHNAME ||
  //   "/"

  // useEffect(() => {
  //   // 2️⃣ Save token in cookie
  //   if (token) {
  //     Cookies.set("accessToken", token, {
  //       expires: 7,
  //       secure: true,
  //       sameSite: "strict",
  //     });
  //   }
  // }, []);

  let activeToken: any = pathname?.split("/").pop() === "auth-admin-activate" ? activationToken : token;



  async function onSubmit(data: NewPasswordFormType,) {
    try {
      const success = await resetPasswordAdmin({
        newPassword: data.password,
      }, router, activeToken)

      if (!success) {
        // optional
      }
    } catch (err: any) {
      getStatusHandler(err?.status, err?.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          Set new password
        </ButtonLoading>
        <Link
          href={ensureLocalizedPathname(
            // Include redirect pathname if available, otherwise default to "/sign-in"
            redirectPathname
              ? ensureRedirectPathname("/sign-in", redirectPathname)
              : "/sign-in",
            locale
          )}
          className="-mt-4 text-center text-sm underline"
        >
          Back to Sign in
        </Link>
      </form>
    </Form>
  )
}
