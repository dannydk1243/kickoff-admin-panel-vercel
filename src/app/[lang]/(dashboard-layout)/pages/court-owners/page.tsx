import type { Metadata } from "next"
import { OwnerDataTable } from "../../(design-system)/tables/_components/tables/owner-data-table"

// Define metadata for the page
export const metadata: Metadata = {
  title: "Court Owners",
}

export default async function RoleManagementPage() {


  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">Court Owners</h2>
      </div>
      <OwnerDataTable />
    </section>
  )
}
