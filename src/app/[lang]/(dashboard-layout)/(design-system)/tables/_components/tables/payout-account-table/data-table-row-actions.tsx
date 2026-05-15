"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash, Power } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { deletePayoutAccount, updatePayoutAccountStatus } from "@/components/dashboards/services/payoutAccountService"

interface PayoutAccountTableRowActionsProps {
  row: Row<any>
  onStatusUpdate: (id: string, updates: any) => void
  onEdit: (account: any) => void
  dictionary: any
}

export function PayoutAccountTableRowActions({
  row,
  onStatusUpdate,
  onEdit,
  dictionary,
}: PayoutAccountTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const account = row.original

  const handleDelete = async () => {
    const success = await deletePayoutAccount()
    if (success) {
      onStatusUpdate(account._id, { isDeleted: true })
    }
  }

  const handleToggleStatus = async () => {
    const newStatus = !account.isActive
    const success = await updatePayoutAccountStatus(account._id, newStatus)
    if (success) {
      onStatusUpdate(account._id, { isActive: newStatus })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => onEdit(account)}>
            <Edit className="mr-2 h-4 w-4" />
            {dictionary?.rowControlLabels?.edit || "Edit"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            <Power className="mr-2 h-4 w-4" />
            {account.isActive
              ? (dictionary?.rowControlLabels?.block || "Deactivate")
              : (dictionary?.rowControlLabels?.unblock || "Activate")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            {dictionary?.rowControlLabels?.delete || "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dictionary?.payoutAccount?.deleteConfirm || "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {dictionary?.confirmationDialog?.deleteDescription || "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dictionary?.rowControlLabels?.cancel || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {dictionary?.rowControlLabels?.confirm || "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
