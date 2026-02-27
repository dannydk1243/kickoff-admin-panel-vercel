"use client"

import { useCallback, useEffect, useState } from "react"
import Cookies from "js-cookie"
import { boolean } from "zod"
import { EllipsisVertical } from "lucide-react"

import type { Row } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { getStatusHandler } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateAdminStatus, sendReinviteMail } from "@/components/dashboards/services/apiService"
import { CustomModal } from "@/components/layout/CustomModal" // Adjust path if needed
import { AdminViewForm } from "@/app/[lang]/(dashboard-layout)/pages/admins/_components/adminViewForm"

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
  isVerified: boolean
  email: string
}

interface InvoiceTableRowActionsProps {
  row: Row<InvoiceTableRow>
  onStatusUpdate: (
    id: string,
    updates: { isBlocked: boolean; isDeleted: boolean }
  ) => void
  dictionary: any
}

export function InvoiceTableRowActions({
  row,
  onStatusUpdate,
  dictionary
}: InvoiceTableRowActionsProps) {
  const id = row.original._id

  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<
    "block" | "unblock" | "delete" | "restore" | null
  >(null)
  const [loading, setLoading] = useState(false)
  const [validReinvite, setValidReinvite] = useState(false)

  const openModalFor = (action: "block" | "unblock" | "delete" | "restore") => {
    setPendingAction(action)
    setModalOpen(true)
  }

  const hasDaysPassed = function (dateISO: string, days: number) {
    const start = new Date(dateISO).getTime()
    const now = Date.now()
    const diff = days * 24 * 60 * 60 * 1000

    return now - start >= diff
  }

  const handleConfirm = useCallback(async () => {
    if (!pendingAction) return

    setLoading(true)

    let isBlocked = row.original.isBlocked
    let isDeleted = row.original.isDeleted

    switch (pendingAction) {
      case "block":
        isBlocked = true
        break
      case "unblock":
        isBlocked = false
        break
      case "delete":
        isDeleted = true
        break
      case "restore":
        isDeleted = false
        break
    }

    try {
      const success = await updateAdminStatus({
        adminId: id,
        isBlocked,
        isDeleted,
      })
      if (success) {
        onStatusUpdate(id, { isBlocked, isDeleted })
        setModalOpen(false)
        setPendingAction(null)
      }
    } catch (error: any) {
      getStatusHandler(error?.status, error?.message)
    } finally {
      setLoading(false)
    }
  }, [
    id,
    onStatusUpdate,
    pendingAction,
    row.original.isBlocked,
    row.original.isDeleted,
  ])

  const sendReinviteEmail = async function () {
    const success = await sendReinviteMail(row.original.email)
  }

  useEffect(() => {
    const value = Cookies.get("adminProfile") ?? ""
    const adminData = JSON.parse(value)
    if (adminData.role == "SUPERADMIN" && !row.original.isVerified) {
      setValidReinvite(true)
    }
  }, [])

  // Modal texts dynamically
  const modalTitle =
    pendingAction === "block"
      ? "Block Confirmation"
      : pendingAction === "unblock"
        ? "Unblock Confirmation"
        : pendingAction === "delete"
          ? "Delete Confirmation"
          : pendingAction === "restore"
            ? "Restore Confirmation"
            : ""

  const modalDescription =
    pendingAction === "block"
      ? "Are you sure you want to block this user?."
      : pendingAction === "unblock"
        ? "Are you sure you want to unblock this user?"
        : pendingAction === "delete"
          ? "Are you sure you want to delete this user? "
          : pendingAction === "restore"
            ? "Are you sure you want to restore this user?"
            : ""

  const viewAdmin = function (id: any) {
    setTimeout(() => setOpen(true), 0)
  }

  return (
    <>
      <div className="flex justify-end me-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0.5"
              aria-label="Open actions"
            >
              <EllipsisVertical className="size-max" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[160px]">

            <DropdownMenuItem onClick={() => viewAdmin(row.original._id)}>
              {dictionary.rowControlLabels.view}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {validReinvite && (
              <>
                <DropdownMenuItem onClick={() => sendReinviteEmail()}>
                  {dictionary.rowControlLabels.reinviteEmail}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem
              onClick={() =>
                openModalFor(row.original.isBlocked ? "unblock" : "block")
              }
            >
              {row.original.isBlocked ? dictionary.rowControlLabels.unblock : dictionary.rowControlLabels.block}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() =>
                openModalFor(row.original.isDeleted ? "restore" : "delete")
              }
            >
              {row.original.isDeleted ? dictionary.rowControlLabels.restore : dictionary.rowControlLabels.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CustomModal
        open={modalOpen}
        title={modalTitle}
        description={modalDescription}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!loading) {
            setModalOpen(false)
            setPendingAction(null)
          }
        }}
        confirmText={pendingAction === "delete" ? dictionary.rowControlLabels.delete : dictionary.rowControlLabels.confirm}
        cancelText={dictionary.rowControlLabels.cancel}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg sm:max-w-[65vw] max-h-[98vh] overflow-visible">
          <AdminViewForm onClose={() => setOpen(false)} adminId={row.original._id} dictionary={dictionary} />
        </DialogContent>
      </Dialog>
    </>
  )
}
