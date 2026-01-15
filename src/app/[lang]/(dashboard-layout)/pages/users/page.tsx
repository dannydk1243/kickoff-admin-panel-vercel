import type { Metadata } from "next"
import { UsersDataTable } from "../../(design-system)/tables/_components/tables/users-data-table"

// Define metadata for the page
export const metadata: Metadata = {
  title: "Users",
}

export default async function UsersManagementPage() {


  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">Users</h2>
      </div>
      <UsersDataTable />
    </section>
  )
}
