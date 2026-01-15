import { cookies } from "next/headers"
import type { Metadata } from "next"
import { AnnouncementDataTable } from "../../(design-system)/tables/_components/tables/announcement-data-table"


// Define metadata for the page
export const metadata: Metadata = {
  title: "Announcement",
}

export default async function AnnouncementManagementPage() {


  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">Announcements</h2>
      </div>
       <AnnouncementDataTable />
    </section>
  )
}
