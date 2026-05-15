import type { Metadata } from "next"
import { WithdrawalDataTable } from "../../(design-system)/tables/_components/tables/withdrawal-data-table"
import { getDictionary } from "@/lib/get-dictionary"
import { LocaleType } from "@/types"

export const metadata: Metadata = {
  title: "Withdrawal",
}

export default async function WithdrawalPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const dictionary = await getDictionary(lang as LocaleType)

  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">{dictionary.navigation.withdrawal}</h2>
      </div>

      <WithdrawalDataTable />
    </section>
  )
}
