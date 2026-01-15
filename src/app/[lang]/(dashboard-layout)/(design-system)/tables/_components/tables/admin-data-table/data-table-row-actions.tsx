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
import { updateAdminStatus } from "@/components/dashboards/services/apiService"
import { getStatusHandler } from "@/lib/utils"

import { CustomModal } from "@/components/layout/CustomModal" // Adjust path if needed

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
}

interface InvoiceTableRowActionsProps {
  row: Row<InvoiceTableRow>
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean }) => void
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

  const openModalFor = (action: "block" | "unblock" | "delete" | "restore") => {
    setPendingAction(action)
    setModalOpen(true)
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
      const success = await updateAdminStatus({ adminId: id, isBlocked, isDeleted })
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
  }, [id, onStatusUpdate, pendingAction, row.original.isBlocked, row.original.isDeleted])

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
                openModalFor(row.original.isDeleted ? "restore" : "delete")
              }
            >
              {row.original.isDeleted ? "Restore" : "Delete"}
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
    </>
  )
}
