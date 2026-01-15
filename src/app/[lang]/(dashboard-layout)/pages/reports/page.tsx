import { cookies } from "next/headers"
import type { Metadata } from "next"
import { DataTable } from "../../(design-system)/tables/_components/tables/admin-data-table"

// Define metadata for the page
export const metadata: Metadata = {
  title: "Reports",
}

export default async function RoleManagementPage() {


  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">Reports</h2>
      </div>
      {/* <DataTable /> */}
    </section>
  )
}
