import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { cookies } from "next/headers"
import { ProfileSettingsForm } from "./_components/profile-settings-form"
import { getDictionary } from "@/lib/get-dictionary"

// Define metadata for the page
export const metadata: Metadata = {
  title: "Profile",
}

export default async function ProfilePage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const { lang } = params

  const dictionary = await getDictionary(lang)

  const cookieStore = await cookies()
  const adminProfile = cookieStore.get("adminProfile")?.value
  const adminData = adminProfile ? JSON.parse(adminProfile) : null

  return (
    <div className="container max-w-4xl py-10 px-4 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.profile.profileSettings}</h1>
        <p className="text-muted-foreground mt-2">
          {dictionary.profile.manageAccount}
        </p>
      </div>

      <ProfileSettingsForm adminData={adminData} dictionary={dictionary} />
    </div>
  )
}
