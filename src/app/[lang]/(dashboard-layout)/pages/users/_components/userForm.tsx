"use client"

import { Key, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Cookies from "js-cookie"
import { CalendarDays } from "lucide-react"

import { DictionaryType } from "@/lib/get-dictionary"
import { useTranslation } from "@/lib/translationContext"
import { getStatusHandler } from "@/lib/utils"

import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUserDetails } from "@/components/dashboards/services/apiService"

export type UserInfoFormType = {
  _id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  address: string | null
  isPhoneVerified: boolean
  isProfileCompleted: boolean
  role: string
  isVerified: boolean
  isBlocked: boolean
  isDeleted: boolean
  deletedByAdmin: boolean
  locale: string
  createdAt: string
  updatedAt: string
  __v: number
}

type UserInfoFormProps = {
  onClose?: () => void
  userId: string
}

export function UserForm({ onClose, userId }: UserInfoFormProps) {
  const [user, setUser] = useState<UserInfoFormType>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    avatar: "",
    address: "",
    isPhoneVerified: false,
    isProfileCompleted: false,
    role: "USER",
    isVerified: false,
    isBlocked: false,
    isDeleted: false,
    deletedByAdmin: true,
    locale: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  })
 useEffect(() => {
  if (!userId) return

  const fetchUserDetails = async () => {
    try {
      const success = await getUserDetails(userId)
      if (success) {
        setUser(success)
      } else {
        onClose?.()
      }
    } catch (error) {
      // It's good practice to log the error or handle it
      console.error("Failed to fetch user:", error)
    }
  }

  fetchUserDetails()
}, [userId]) // <--- Add this! Now it only runs when userId changes

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="text-xl font-semibold">{user.name}</div>

        <Badge variant={user.isBlocked ? "destructive" : "default"}>
          {user.role}
        </Badge>
      </div>
      <div className="text-lg text-muted-foreground">{user.email}</div>
      <div className="text-xs font-mono text-muted-foreground">{user._id}</div>

      <div className="space-y-4 py-4">
        {/* Status Section */}
        <div className="grid grid-cols-2 gap-4">
          <StatusItem label="Verified" value={user.isVerified} />
          <StatusItem label="Profile Done" value={user.isProfileCompleted} />
          <StatusItem label="Phone Verified" value={user.isPhoneVerified} />
          <StatusItem label="Locale" text={user.locale} />
        </div>

        {/* Details Section */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span>{user.phone || "Not provided"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Address:</span>
            <span className="text-right">{user.address || "N/A"}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button asChild className="w-full" variant="outline">
            <Link
              href={`/pages/bookings?userId=${user._id}`}
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              All Bookings
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
function StatusItem({
  label,
  value,
  text,
}: {
  label: string
  value?: boolean
  text?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {text ? (
        <span className="text-sm font-medium">{text}</span>
      ) : (
        <Badge variant={value ? "outline" : "secondary"} className="w-fit">
          {value ? "Yes" : "No"}
        </Badge>
      )}
    </div>
  )
}
