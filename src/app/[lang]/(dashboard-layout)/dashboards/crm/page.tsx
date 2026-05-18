import type { Metadata } from "next"
import { cookies } from "next/headers"
import { AnalyticsPageClient } from "./_components/AnalyticsPageClient"
import { getDictionary } from "@/lib/get-dictionary"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Analytics",
}

export default async function AnalyticsPage({ params }: { params: { lang: string } }) {
  // CRITICAL: Explicitly await cookies() to force Next.js to treat this RSC payload as 
  // strictly cookie-dependent. This prevents Vercel from stripping cookies on RSC prefetches!
  const cookieStore = await cookies()
  const dictionary = await getDictionary(params.lang as "en" | "ar")

  const userCookie = cookieStore.get("adminProfile")?.value
  let user = null
  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie))
    } catch (e) {
      console.error("Failed to parse adminProfile cookie", e)
    }
  }

  return <AnalyticsPageClient dictionary={dictionary} user={user} />
}
