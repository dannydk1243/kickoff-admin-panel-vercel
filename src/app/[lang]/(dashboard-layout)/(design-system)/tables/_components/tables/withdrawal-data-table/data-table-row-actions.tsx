"use client"

import { useState, useCallback, useEffect } from "react"
import { EllipsisVertical } from "lucide-react"
import type { Row } from "@tanstack/react-table"
import Cookies from "js-cookie"
import { ROLES } from "@/lib/enum"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import { CustomModal } from "@/components/layout/CustomModal"
import { WithdrawalDetailView } from "@/app/[lang]/(dashboard-layout)/pages/withdrawal/_components/WithdrawalDetailView"

interface WithdrawalTableRowActionsProps {
  row: Row<any>
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean, status?: string }) => void
  dictionary: any
}

export function WithdrawalTableRowActions({
  row,
  onStatusUpdate,
  dictionary,
}: WithdrawalTableRowActionsProps) {
  const id = row.original._id

  const [open, setOpen] = useState(false)
  const [rowData, setRowData] = useState<any>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userRole, setUserRole] = useState<string | undefined>()

  useEffect(() => {
    const value = Cookies.get("adminProfile") ?? ""
    if (value) {
      try {
        const adminData = JSON.parse(value)
        setUserRole(adminData.role)
      } catch (e) {
        console.error("Error parsing adminProfile cookie", e)
      }
    }
  }, [])

  const handleConfirm = useCallback(async () => {
    // Logic for other actions if any
    setModalOpen(false)
    setPendingAction(null)
  }, [])

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
            <DropdownMenuItem onClick={handleView}>
              {dictionary.rowControlLabels.view}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CustomModal
        open={modalOpen}
        title={pendingAction || ""}
        description=""
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!loading) {
            setModalOpen(false)
            setPendingAction(null)
          }
        }}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg sm:max-w-[85vw] md:max-w-[70vw] lg:max-w-[1000px] max-h-[85vh] flex flex-col">
          <WithdrawalDetailView
            onClose={() => setOpen(false)}
            data={rowData}
            dictionary={dictionary}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
