import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { getDictionary } from "@/lib/get-dictionary"

import { Layout } from "./_components/layout"

export default async function LandingLayout(props: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const locale = lang as "en" | "ar"
  const { children } = props

  const dictionary = await getDictionary(locale)

  return <Layout dictionary={dictionary}>{children}</Layout>
}
