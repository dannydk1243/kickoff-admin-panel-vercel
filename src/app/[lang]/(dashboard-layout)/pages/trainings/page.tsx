import type { Metadata } from "next"
import { TrainingDataTable } from "../../(design-system)/tables/_components/tables/trainings-data-table"
import { LocaleType } from "@/types"
import { getDictionary } from "@/lib/get-dictionary"

// Define metadata for the page
export const metadata: Metadata = {
  title: "Trainings",
}

export default async function TrainingsPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const dictionary = await getDictionary(lang as LocaleType)

  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">{dictionary.navigation.trainings}</h2>
      </div>
      <TrainingDataTable />
    </section>
  )
}
