import type { Metadata } from "next"
import { AnalyticsPageClient } from "./_components/AnalyticsPageClient"

export const metadata: Metadata = {
  title: "Analytics",
}

export default function AnalyticsPage() {
  return <AnalyticsPageClient />
}
