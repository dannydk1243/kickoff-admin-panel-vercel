"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { EllipsisVertical } from "lucide-react"

import type { Row } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { getStatusHandler } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CourtForm } from "@/app/[lang]/(dashboard-layout)/pages/courts/_components/courtForm"
import {
  deleteCourtById,
  getOnlyOwners,
} from "@/components/dashboards/services/apiService"
import { CustomModal } from "@/components/layout/CustomModal" // Adjust path if needed

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
}

interface InvoiceTableRowActionsProps {
  row: Row<InvoiceTableRow>
  onStatusUpdate: (
    id: string,
    updates: { isBlocked: boolean; isDeleted: boolean }
  ) => void
}

export function InvoiceTableRowActions({
  row,
  onStatusUpdate,
}: InvoiceTableRowActionsProps) {
  let id = row.original._id

  const [modalOpen, setModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<
    "delete" | "restore" | null
  >(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const openModalFor = (action: "delete" | "restore") => {
    setPendingAction(action)
    setModalOpen(true)
  }

  const handleConfirm = useCallback(async () => {
    if (!pendingAction) return

    setLoading(true)

    let isDeleted = row.original.isDeleted

    switch (pendingAction) {
      case "delete":
        isDeleted = true
        break
      case "restore":
        isDeleted = false
        break
    }

    try {
      const success = await deleteCourtById(id, isDeleted)
      if (success) {
        onStatusUpdate(id, { isBlocked: row.original.isBlocked, isDeleted })
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // setLoading(true);
  //     const res = await getOnlyOwners();

  //     if (res?.admins) {
  //       setAllOwnersList(res.admins);
  //       // setTotalCount(res.pagination.total); // ✅ TOTAL ROWS
  //     } else {
  //       setAllOwnersList([]);
  //       // setTotalCount(0);
  //     }

  //   };

  //   fetchData();
  // }, []);

  const modalTitle =
    pendingAction === "delete"
      ? "Delete Confirmation"
      : pendingAction === "restore"
        ? "Restore Confirmation"
        : ""

  const modalDescription =
    pendingAction === "delete"
      ? "Are you sure you want to delete this user?"
      : pendingAction === "restore"
        ? "Are you sure you want to restore this user?"
        : ""
  const searchParams = useSearchParams()

  // Add your Edit handler here or pass via props, example:
  const [paramId, setParamId] = useState<string | null>(null)
  useEffect(() => {
    let val = searchParams.get("id")
    setParamId(val)
  }, [])

  const handleView = () => {
    setParamId(id)
    setTimeout(() => setOpen(true), 0)
  }

  const handleEdit = () => {
    setParamId("")
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
            <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg sm:max-w-[65vw] max-h-[98vh] overflow-visible">
          <CourtForm
            onClose={() => setOpen(false)}
            courtId={id}
            view={paramId != null && paramId != ""}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
