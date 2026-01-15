import { cookies } from "next/headers"
import type { Metadata } from "next"
import { CourtDataTable } from "../../(design-system)/tables/_components/tables/court-data-table"

// Define metadata for the page
export const metadata: Metadata = {
  title: "Courts",
}

export default async function CourtsManagementPage() {


  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">Courts</h2>
      </div>
      <CourtDataTable />

    </section>
  )
}
