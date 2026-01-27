"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { EllipsisVertical } from "lucide-react"

import type { Row } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { getStatusHandler } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserForm } from "@/app/[lang]/(dashboard-layout)/pages/users/_components/userForm"
import { updateUserStatus } from "@/components/dashboards/services/apiService"
import { CustomModal } from "@/components/layout/CustomModal" // Adjust path if needed

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
  deletedByAdmin?: boolean
}

interface InvoiceTableRowActionsProps {
  row: Row<InvoiceTableRow>
  onStatusUpdate: (
    id: string,
    updates: {
      isBlocked: boolean
      isDeleted: boolean
      deletedByAdmin?: boolean
    }
  ) => void
}

export function InvoiceTableRowActions({
  row,
  onStatusUpdate,
}: InvoiceTableRowActionsProps) {
  const id = row.original._id

  const [modalOpen, setModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<
    "block" | "unblock" | "delete" | "restore" | null
  >(null)
  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const isActuallyDeleted =
    row.original.isDeleted || row.original.deletedByAdmin

  const openModalFor = (action: "block" | "unblock" | "delete" | "restore") => {
    setPendingAction(action)
    setModalOpen(true)
  }

  const handleConfirm = useCallback(async () => {
    if (!pendingAction) return

    setLoading(true)

    let isBlocked = row.original.isBlocked
    let isDeleted = row.original.isDeleted
    let deletedByAdmin = row.original.deletedByAdmin ?? false

    switch (pendingAction) {
      case "block":
        isBlocked = true
        break

      case "unblock":
        isBlocked = false
        break

      case "delete":
        isDeleted = true
        deletedByAdmin = true
        break

      case "restore":
        isDeleted = false
        deletedByAdmin = false
        break
    }

    try {
      const success = await updateUserStatus({
        userId: id,
        isBlocked,
        isDeleted,
      })

      if (success) {
        onStatusUpdate(id, { isBlocked, isDeleted, deletedByAdmin })
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
    row.original.deletedByAdmin,
  ])

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

  const viewUser = function (id: any) {
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
            <DropdownMenuItem onClick={() => viewUser(row.original._id)}>
              View
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                openModalFor(row.original.isBlocked ? "unblock" : "block")
              }
            >
              {row.original.isBlocked ? "Unblock" : "Block"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() =>
                openModalFor(isActuallyDeleted ? "restore" : "delete")
              }
            >
              {isActuallyDeleted ? "Restore" : "Delete"}
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
        confirmText={pendingAction === "delete" ? "Delete" : "Confirm"}
        cancelText="Cancel"
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg sm:max-w-[65vw] max-h-[98vh] overflow-visible">
          <UserForm onClose={() => setOpen(false)} userId={row.original._id} />
        </DialogContent>
      </Dialog>
    </>
  )
}
