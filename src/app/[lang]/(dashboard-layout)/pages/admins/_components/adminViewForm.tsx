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
import { getAdminDetails } from "@/components/dashboards/services/apiService"

export type AdminInfoFormType = {
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

type AdminInfoFormProps = {
    onClose?: () => void
    adminId: string
    dictionary: DictionaryType
}

export function AdminViewForm({ onClose, adminId, dictionary }: AdminInfoFormProps) {
    const [admin, setAdmin] = useState<AdminInfoFormType>({
        _id: "",
        name: "",
        email: "",
        phone: "",
        avatar: "",
        address: "",
        isPhoneVerified: false,
        isProfileCompleted: false,
        role: "ADMIN",
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
        if (!adminId) return

        const fetchAdminDetails = async () => {
            try {
                const success = await getAdminDetails(adminId)
                if (success) {
                    setAdmin(success)
                } else {
                    onClose?.()
                }
            } catch (error) {
                // It's good practice to log the error or handle it
                console.error("Failed to fetch admin:", error)
            }
        }

        fetchAdminDetails()
    }, [adminId]) // <--- Add this! Now it only runs when adminId changes

    return (
        <>
            <div className="flex items-center gap-3">
                <div className="text-xl font-semibold">{admin.name}</div>

                <Badge variant={admin.isBlocked ? "destructive" : "default"}>
                    {admin.role}
                </Badge>
            </div>
            <div className="text-lg text-muted-foreground">{admin.email}</div>
            <div className="text-xs font-mono text-muted-foreground">{admin._id}</div>

            <div className="space-y-4 py-4">
                {/* Status Section */}
                <div className="grid grid-cols-2 gap-4">
                    <StatusItem label={dictionary.dialogFormLabels.verified} value={admin.isVerified} dictionary={dictionary} />
                    <StatusItem label={dictionary.dialogFormLabels.profileDone} value={admin.isProfileCompleted} dictionary={dictionary} />
                    <StatusItem label={dictionary.dialogFormLabels.phoneVerified} value={admin.isPhoneVerified} dictionary={dictionary} />
                    <StatusItem label={dictionary.dialogFormLabels.locale} text={admin.locale} dictionary={dictionary} />
                </div>

                {/* Details Section */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{dictionary.dialogFormLabels.phone}:</span>
                        <span>{admin.phone || dictionary.dialogFormLabels.notProvided}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{dictionary.dialogFormLabels.address}:</span>
                        <span className="text-right">{admin.address || dictionary.dialogFormLabels.notProvided}</span>
                    </div>
                </div>

                {/* <div className="pt-2">
                    <Button asChild className="w-full" variant="outline">
                        <Link
                            href={`/pages/bookings?adminId=${admin._id}`}
                            className="flex items-center gap-2"
                        >
                            <CalendarDays className="h-4 w-4" />
                            All Bookings
                        </Link>
                    </Button>
                </div> */}
            </div>
        </>
    )
}
function StatusItem({
    label,
    value,
    text,
    dictionary,
}: {
    label: string
    value?: boolean
    text?: string
    dictionary: DictionaryType
}) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{label}</span>
            {text ? (
                <span className="text-sm font-medium">{text}</span>
            ) : (
                <Badge variant={value ? "outline" : "secondary"} className="w-fit">
                    {value ? dictionary.dialogFormLabels.yes : dictionary.dialogFormLabels.no}
                </Badge>
            )}
        </div>
    )
}
