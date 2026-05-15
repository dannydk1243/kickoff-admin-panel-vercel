import type { Metadata } from "next"
import { getDictionary } from "@/lib/get-dictionary"
import { LocaleType } from "@/types"
import { PayoutAccountPageClient } from "./_components/PayoutAccountPageClient"

export const metadata: Metadata = {
  title: "Payout Accounts",
}

export default async function PayoutAccountPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const dictionary = await getDictionary(lang as LocaleType)

  return (
    <section className="grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-4xl font-semibold">{dictionary?.payoutAccount?.title || "Payout Accounts"}</h2>
        <p className="text-muted-foreground">{dictionary?.payoutAccount?.description || "Manage bank accounts for payouts."}</p>
      </div>

      <div className="w-full">
        <PayoutAccountPageClient dictionary={dictionary} />
      </div>
    </section>
  )
}
