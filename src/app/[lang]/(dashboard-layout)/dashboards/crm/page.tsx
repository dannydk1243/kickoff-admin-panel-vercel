import type { Metadata } from "next"
import { cookies } from "next/headers"
import { AnalyticsPageClient } from "./_components/AnalyticsPageClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Analytics",
}

export default async function AnalyticsPage() {
  // CRITICAL: Explicitly await cookies() to force Next.js to treat this RSC payload as 
  // strictly cookie-dependent. This prevents Vercel from stripping cookies on RSC prefetches!
  await cookies()
  
  return <AnalyticsPageClient />
}
