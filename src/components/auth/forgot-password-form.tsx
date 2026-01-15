"use client"

import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { ForgotPasswordFormType, LocaleType } from "@/types"

import { ForgotPasswordSchema } from "@/schemas/forgot-passward-schema"

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
import { forgotPasswordAdmin } from "./authService"

export function ForgotPasswordForm() {
  const params = useParams()
  const searchParams = useSearchParams()

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const locale = params.lang as LocaleType
  const redirectPathname = searchParams.get("redirectTo")
  const { isSubmitting, isDirty } = form.formState
  const isDisabled = isSubmitting || !isDirty // Disable button if form is unchanged or submitting

  // async function onSubmit(_data: ForgotPasswordFormType) {
  //   try {
  //     console.log("_data", _data.email);

  //     toast({
  //       title: "Check your email",
  //       description:
  //         "We've sent you an email with instructions to reset your password.",
  //     })
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Something went wrong",
  //       description: error instanceof Error ? error.message : undefined,
  //     })
  //   }
  // }

  async function onSubmit(data: ForgotPasswordFormType) {
    try {
      const success = await forgotPasswordAdmin({
        email: data.email,
      })

      if (!success) {
        // optional: handle failed case if needed
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          Send Email
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
