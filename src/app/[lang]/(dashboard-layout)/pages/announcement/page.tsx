import { cookies } from "next/headers"
import type { Metadata } from "next"
import { AnnouncementDataTable } from "../../(design-system)/tables/_components/tables/announcement-data-table"
import { LocaleType } from "@/types"
import { getDictionary } from "@/lib/get-dictionary"


// Define metadata for the page
export const metadata: Metadata = {
  title: "Announcement",
}

export default async function AnnouncementManagementPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const dictionary = await getDictionary(lang as LocaleType)

  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">{dictionary.navigation.announcement}</h2>
      </div>
      <AnnouncementDataTable />
    </section>
  )
}
