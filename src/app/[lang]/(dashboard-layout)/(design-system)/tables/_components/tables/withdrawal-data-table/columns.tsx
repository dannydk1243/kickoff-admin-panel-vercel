"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { WithdrawalTableRowActions } from "./data-table-row-actions"
import { Badge } from "@/components/ui/badge"

type WithdrawalRow = {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  userType: "User" | "Admin"
  beneficiaryAccount: {
    _id: string
    name: string
    iban: string
    mobile: string
    country: string
    city: string
    type: string
    userType: string
  }
  source_id: string
  sequence_number: string
  amount: number
  purpose: string
  comment: string
  status: string
  createdAt: string
  updatedAt: string
}

export const getColumns = (
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean, status?: string }) => void,
  dictionary: any
): ColumnDef<WithdrawalRow>[] => [
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.id || "ID"} />
      ),
      cell: ({ row }) => {
        const id = row.getValue("_id") as string
        return <div className="font-mono font-medium  ">{id}</div>
      },
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.name || "User Name"} />
      ),
      cell: ({ row }) => {
        const name = row.original.user?.name || 'N/A'
        const email = row.original.user?.email || ''
        return (
          <div>
            <p className="font-medium">{name}</p>
            {/* <p className="text-xs text-muted-foreground">{email}</p> */}
          </div>
        )
      },
    },
    {
      accessorKey: "userType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.userType || "Type"} />
      ),
      cell: ({ row }) => {
        const userType = row.getValue("userType") as string
        return <span className="text-xs font-medium">{userType}</span>
      },
    },
    {
      accessorKey: "beneficiaryAccount.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.withdrawal?.accountDetails?.name || "Beneficiary"} />
      ),
      cell: ({ row }) => {
        const name = row.original.beneficiaryAccount?.name || 'N/A'
        return <span>{name}</span>
      },
    },
    {
      accessorKey: "beneficiaryAccount.iban",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.withdrawal?.accountDetails?.iban || "IBAN"} />
      ),
      cell: ({ row }) => {
        const iban = row.original.beneficiaryAccount?.iban || 'N/A'
        return <span className="font-mono text-xs">{iban}</span>
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.withdrawal?.request?.amount || "Amount"} />
      ),
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number
        return (
          <div className="font-medium">
            <span>SAR </span>
            <span>{amount.toFixed(2)}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: dictionary?.tableColumnLabels?.status || "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variantMap: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
          PENDING: "secondary",
          APPROVED: "default",
          REJECTED: "destructive",
          COMPLETED: "default",
        }
        return (
          <Badge variant={variantMap[status] || "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.userWallet?.created || "Created"} />
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string
        return <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
      },
      meta: {
        alignment: "right",
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <WithdrawalTableRowActions row={row as any} onStatusUpdate={onStatusUpdate} dictionary={dictionary} />
      ),
    },
  ]
