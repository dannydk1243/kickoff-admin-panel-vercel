import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { getDictionary } from "@/lib/get-dictionary"
import { Layout } from "@/components/layout"
import NextAuthSessionProvider from "@/components/providers/session-provider"
import { cookies } from "next/headers"
import { log } from "console"
import { TranslationProvider } from "@/lib/translationContext"

export default async function DashboardLayout(props: {
  children: ReactNode
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const { children } = props

  const dictionary = await getDictionary(params.lang)

  const cookieStore = await cookies()
  const adminProfile = cookieStore.get("adminProfile")?.value
  const adminData = adminProfile ? JSON.parse(adminProfile) : null

  log("accessTokenlayout", adminData);

  return (
    <NextAuthSessionProvider>
      <TranslationProvider dictionary={dictionary}>
        <Layout dictionary={dictionary} adminData={adminData}>
          {children}
        </Layout>
      </TranslationProvider>
    </NextAuthSessionProvider>

  )
}
