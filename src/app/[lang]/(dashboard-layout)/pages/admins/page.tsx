import { cookies } from "next/headers"
import type { Metadata } from "next"
import { AdminDataTable } from "../../(design-system)/tables/_components/tables/admin-data-table"

// Define metadata for the page
export const metadata: Metadata = {
  title: "Admins",
}

export default async function AdminsManagementPage() {



  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">Admins</h2>
      </div>
      <AdminDataTable />
    </section>
  )
}
