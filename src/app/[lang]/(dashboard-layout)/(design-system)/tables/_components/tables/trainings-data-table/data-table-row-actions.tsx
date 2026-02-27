"use client"

import { useState, useCallback } from "react"
import { EllipsisVertical } from "lucide-react"
import type { Row } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cancelBooking, updateAdminStatus } from "@/components/dashboards/services/apiService"
import { getStatusHandler } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import { BookingForm } from "@/app/[lang]/(dashboard-layout)/pages/bookings/_components/bookingForm"

import { CustomModal } from "@/components/layout/CustomModal" // Adjust path if needed

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
}

interface InvoiceTableRowActionsProps {
  row: Row<InvoiceTableRow>
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean, status?: string }) => void,
  dictionary: any
}

export function InvoiceTableRowActions({
  row,
  onStatusUpdate,
  dictionary
}: InvoiceTableRowActionsProps) {
  const id = row.original._id

  const [open, setOpen] = useState(false)
  const [rowData, setRowData] = useState<any>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<
    "block" | "unblock" | "delete" | "restore" | "cancel" | null
  >(null)
  const [loading, setLoading] = useState(false)

  const openModalFor = (action: "block" | "unblock" | "delete" | "restore" | "cancel") => {
    setPendingAction(action)
    setModalOpen(true)
  }

  const handleConfirm = useCallback(async () => {
    if (!pendingAction) return

    setLoading(true)

    let isBlocked = row.original.isBlocked
    let isDeleted = row.original.isDeleted
    let isCancelled = row.original.status === "CANCELLED"

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
      case "cancel":
        isCancelled = true
        break
    }

    try {
      const success = await cancelBooking({ bookingId: id })
      if (success) {
        onStatusUpdate(id, { isBlocked, isDeleted, status: "CANCELLED" })
        setModalOpen(false)
        setPendingAction(null)
      }
    } catch (error: any) {
      getStatusHandler(error?.status, error?.message)
    } finally {
      setLoading(false)
    }
  }, [id, onStatusUpdate, pendingAction, row.original.isBlocked, row.original.isDeleted, row.original.status])

  // Modal texts dynamically
  const modalTitle =
    pendingAction === "block"
      ? dictionary.confirmationDialog?.blockTitle || "Block Confirmation"
      : pendingAction === "unblock"
        ? dictionary.confirmationDialog?.unblockTitle || "Unblock Confirmation"
        : pendingAction === "delete"
          ? dictionary.confirmationDialog?.deleteTitle || "Delete Confirmation"
          : pendingAction === "restore"
            ? dictionary.confirmationDialog?.restoreTitle || "Restore Confirmation"
            : pendingAction === "cancel"
              ? dictionary.confirmationDialog?.cancelTitle || "Cancel Confirmation"
              : ""

  const modalDescription =
    pendingAction === "block"
      ? dictionary.confirmationDialog?.blockDescription || "Are you sure you want to block this user?"
      : pendingAction === "unblock"
        ? dictionary.confirmationDialog?.unblockDescription || "Are you sure you want to unblock this user?"
        : pendingAction === "delete"
          ? dictionary.confirmationDialog?.deleteDescription || "Are you sure you want to delete this user?"
          : pendingAction === "restore"
            ? dictionary.confirmationDialog?.restoreDescription || "Are you sure you want to restore this user?"
            : pendingAction === "cancel"
              ? dictionary.confirmationDialog?.cancelTrainingDescription || "Are you sure you want to cancel this training?"
              : ""
  const handleView = () => {
    setRowData(row.original)
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
            <DropdownMenuItem onClick={handleView}>{dictionary.rowControlLabels.view}</DropdownMenuItem>
            {/* <DropdownMenuItem
                   onClick={() =>
                     openModalFor(row.original.isBlocked ? "unblock" : "block")
                   }
                 >
                   {row.original.isBlocked ? "Unblock" : "Block"}
                 </DropdownMenuItem> */}



            {row.original.status !== "CANCELLED" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() =>
                    openModalFor("cancel")
                  }
                >
                  {dictionary.rowControlLabels.cancel}
                </DropdownMenuItem>
              </>

            )}
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
        confirmText={pendingAction === "delete" ? "Delete" : "Confirm"}
        cancelText="Cancel"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg sm:max-w-[65vw] max-h-[98vh] overflow-visible">
          <BookingForm
            onClose={() => setOpen(false)}
            bookingDetails={rowData}
            dictionary={dictionary}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
