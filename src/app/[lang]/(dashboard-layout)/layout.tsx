import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { getDictionary } from "@/lib/get-dictionary"
import { Layout } from "@/components/layout"
import NextAuthSessionProvider from "@/components/providers/session-provider"
import { cookies } from "next/headers"
import { log } from "console"
import { TranslationProvider } from "@/lib/translationContext"

// 1. Change LocaleType to string in the Promise definition
// This satisfies Next.js's internal __Check validator
interface LayoutProps {
  children: ReactNode
  params: Promise<{ lang: string }> 
}

export default async function DashboardLayout({ children, params }: LayoutProps) {
  // 2. Await the params
  const resolvedParams = await params
  
  // 3. Narrow the type manually to LocaleType for your logic
  const lang = resolvedParams.lang as LocaleType

  const dictionary = await getDictionary(lang)

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