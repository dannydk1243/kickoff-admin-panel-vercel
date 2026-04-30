"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updatePasswordAdmin, updateProfileAdmin, logoutAdmin } from "@/components/auth/authService"
import { toast } from "@/hooks/use-toast"
import { AdminProfile } from "@/types"
import { User, Mail, Phone, Shield, Lock } from "lucide-react"

export function ProfileSettingsForm({
  adminData,
  dictionary
}: {
  adminData: AdminProfile | null
  dictionary: any
}) {
  const router = useRouter()
  const [name, setName] = useState(adminData?.name || "")
  const [phone, setPhone] = useState(adminData?.phone || "")
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: dictionary.profile.error || "Error",
        description: dictionary.profile.enterPassword,
      })
      return
    }

    setIsResetting(true)
    try {
      const res = await updatePasswordAdmin({ currentPassword: newPassword })

      if (res) {
        toast({
          title: dictionary.profile.profileUpdated,
          description: dictionary.profile.newPasswordSet,
        })
        setNewPassword("")
        // Log the user out after a password change for security
        setTimeout(() => {
          logoutAdmin()
        }, 5000)
      }
    } catch (err: any) {
      console.error(err)
      toast({
        variant: "destructive",
        title: dictionary.profile.error || "Error",
        description: err?.message || dictionary.profile.failedToUpdateProfile,
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use the registration/update API logic from settings
      const success = await updateProfileAdmin(
        { name: name, phone: phone },
      )

      if (success) {
        // Update the adminProfile cookie so the server component picks up new values
        const existing = Cookies.get("adminProfile")
        if (existing) {
          const parsed: AdminProfile = JSON.parse(existing)
          parsed.name = name
          parsed.phone = phone
          Cookies.set("adminProfile", JSON.stringify(parsed), {
            expires: 7,
            secure: true,
            sameSite: "strict",
          })
        }
        toast({
          title: dictionary.profile.profileUpdated,
          description: dictionary.profile.profileSaveSuccess,
        })
        // Re-run server components so the header reflects updated name/phone
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        title: dictionary.profile.error || "Error",
        description: dictionary.profile.failedToUpdateProfile,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <Card className="md:col-span-2 shadow-sm border-muted">
        <CardHeader className="bg-muted/10 border-b pb-6">
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            {dictionary.profile.personalInformation}
          </CardTitle>
          <CardDescription>
            {dictionary.profile.updatePersonalDetails}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                {dictionary.profile.fullName}
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dictionary.placeholder.enterName}
                required
                className="bg-background transition-shadow focus-visible:ring-primary h-11"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                {dictionary.profile.phoneNumber}
              </label>
              <div className="w-full">
                <PhoneNumberInput
                  value={phone}
                  onChange={(value) => setPhone(value || "")}
                  label=""
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-sm border-muted">
        <CardHeader className="bg-muted/10 border-b pb-6">
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            {dictionary.profile.accountInformation}
          </CardTitle>
          <CardDescription>
            {dictionary.profile.readOnlyDetails}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 bg-muted/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                {dictionary.profile.emailAddress}
              </label>
              <Input
                value={adminData?.email || ""}
                disabled
                className="bg-muted/30 text-muted-foreground outline-none border-dashed h-11"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" />
                {dictionary.profile.role}
              </label>
              <Input
                value={adminData?.role || "ADMIN"}
                disabled
                className="bg-muted/30 text-muted-foreground outline-none border-dashed h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-sm border-muted">
        <CardHeader className="bg-muted/10 border-b pb-6">
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5 text-primary" />
            {dictionary.profile.password}
          </CardTitle>
          <CardDescription>
            {dictionary.profile.manageAccount}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                {dictionary.profile.password}
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={dictionary.profile.enterPassword}
                className="bg-background transition-shadow focus-visible:ring-primary h-11"
              />
            </div>
            <div>
              <Button
                type="button"
                onClick={handleResetPassword}
                disabled={isResetting || !newPassword}
                variant="outline"
                className="h-11 w-full md:w-auto px-8 border-primary text-primary hover:bg-primary/5"
              >
                {isResetting ? dictionary.profile.savingChanges : dictionary.profile.resetPassword}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 flex justify-end gap-4 mt-2">
        <Button
          disabled={isLoading}
          type="submit"
          size="lg"
          className="min-w-32 shadow-sm"
        >
          {isLoading ? dictionary.profile.savingChanges : dictionary.profile.saveChanges}
        </Button>
      </div>
    </form>
  )
}
