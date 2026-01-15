"use client"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { ReactNode } from "react"

import { useIsVertical } from "@/hooks/use-is-vertical"
import { Customizer } from "./customizer"
import { HorizontalLayout } from "./horizontal-layout"
import { VerticalLayout } from "./vertical-layout"
import { AdminProfile } from "@/types"



export function Layout({
  children,
  dictionary,
  adminData
}: {
  children: ReactNode
  dictionary: DictionaryType
  adminData: AdminProfile | null
}) {
  const isVertical = useIsVertical()

  return (
    <>
      <Customizer />
      {/* If the layout is vertical, render a vertical layout; otherwise, render a horizontal layout */}
      {isVertical ? (
        <VerticalLayout dictionary={dictionary} adminData={adminData}>{children}</VerticalLayout>
      ) : (
        <HorizontalLayout dictionary={dictionary} adminData={adminData}>{children}</HorizontalLayout>
      )}
    </>
  )
}
