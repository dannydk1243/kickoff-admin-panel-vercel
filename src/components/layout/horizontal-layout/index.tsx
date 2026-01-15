import type { DictionaryType } from "@/lib/get-dictionary"
import type { ReactNode } from "react"
// import { cookies } from "next/headers"

import { Footer } from "../footer"
import { Sidebar } from "../sidebar"
import { HorizontalLayoutHeader } from "./horizontal-layout-header"
import { AdminProfile } from "@/types"

// Make your component async
export async function HorizontalLayout({
  children,
  dictionary,
  adminData
}: {
  children: React.ReactNode
  dictionary: DictionaryType
  adminData: AdminProfile | null
}) {

  return (
    <>
      <Sidebar dictionary={dictionary} adminData={adminData} />
      <div className="w-full">
        <HorizontalLayoutHeader dictionary={dictionary} />
        <main className="min-h-[calc(100svh-9.85rem)] bg-muted/40">{children}</main>
        <Footer />
      </div>
    </>
  )
}

