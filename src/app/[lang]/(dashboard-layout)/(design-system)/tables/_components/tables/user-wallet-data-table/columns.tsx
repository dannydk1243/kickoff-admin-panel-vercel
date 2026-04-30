"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { InvoiceTableRowActions } from "./data-table-row-actions"
import { Badge } from "@/components/ui/badge"

type WalletRow = {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  userType: string
  currency: string
  balance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export const getColumns = (
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean }) => void,
  dictionary: any
): ColumnDef<WalletRow>[] => [
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.id || "Wallet ID"} />
    ),
    cell: ({ row }) => {
      const id = row.getValue("_id") as string
      return <div className="font-mono font-medium">{id}</div>
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.name || "User Name"} />
    ),
    cell: ({ row }) => {
      const name = row.original.user?.name || 'N/A'
      return <span>{name}</span>
    },
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.email || "Email"} />
    ),
    cell: ({ row }) => {
      const email = row.original.user?.email || 'N/A'
      return <span>{email}</span>
    },
  },

  {
    accessorKey: "userType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Type" />
    ),
    cell: ({ row }) => {
      let type = row.getValue("userType") as string
      if (type == 'Admin'){ type = 'Owner' }
      return <span className="font-medium capitalize">{type}</span>
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.balance || "Balance"} />
    ),
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number
      const currency = row.original.currency
      return (
        <div className="font-medium">
          <span>{currency} </span>
          <span>{balance.toFixed(2)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
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
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string
      return <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
    },
    meta: {
      alignment: "right",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <InvoiceTableRowActions row={row as any} onStatusUpdate={onStatusUpdate} dictionary={dictionary} />
    ),
  },
]
