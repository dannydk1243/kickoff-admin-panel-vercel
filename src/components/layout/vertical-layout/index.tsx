import type { DictionaryType } from "@/lib/get-dictionary"
import type { ReactNode } from "react"

import { Footer } from "../footer"
import { Sidebar } from "../sidebar"
import { VerticalLayoutHeader } from "./vertical-layout-header"
import { AdminProfile } from "@/types"
// import { cookies } from "next/headers"

export function VerticalLayout({
  children,
  dictionary,
  adminData
}: {
  children: ReactNode
  dictionary: DictionaryType
  adminData: AdminProfile | null
}) {



  return (
    <>
      <Sidebar dictionary={dictionary} adminData={adminData} />
      <div className="w-full">
        <VerticalLayoutHeader dictionary={dictionary} adminData={adminData} />
        <main className="min-h-[calc(100svh-6.82rem)] bg-muted/40">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
