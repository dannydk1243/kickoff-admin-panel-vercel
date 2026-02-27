import type { Metadata } from "next"
import { BookingDataTable } from "../../(design-system)/tables/_components/tables/booking-data-table"
import { getDictionary } from "@/lib/get-dictionary"
import { LocaleType } from "@/types"

// Define metadata for the page
export const metadata: Metadata = {
  title: "Refunds",
}

export default async function RefundsPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const dictionary = await getDictionary(lang as LocaleType)

  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">{dictionary.navigation.refunds}</h2>
      </div>
      <BookingDataTable />
    </section>
  )
}
