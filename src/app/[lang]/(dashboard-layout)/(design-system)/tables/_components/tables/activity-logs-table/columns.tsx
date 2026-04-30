"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { InvoiceTableRowActions } from "./data-table-row-actions"

type InvoiceTableRow = {
  _id: string
  name: string
  email: string
  avatar: string | null
  wallet: {
    currentBalance: number
    currency: string
    totalTopUps: number
    totalRefunds: number
    totalPayments: number
    transactionCount: number
    status: string
  }
  lastUpdated: string
  createdAt: string
  __v: number
}

// Accept the handler and return columns array
export const getColumns = (
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean }) => void,
  dictionary: any
): ColumnDef<InvoiceTableRow>[] => [
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.id || "User ID"} />
      ),
      cell: ({ row }) => {
        const id = row.getValue<string>("_id")
        return <span>{id}</span>
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.name || "Name"} />
      ),
      cell: ({ row }) => {
        return <span>{row.original.name}</span>
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.email || "Email"} />
      ),
      cell: ({ row }) => {
        return <span>{row.original.email}</span>
      },
    },
    {
      accessorKey: "wallet.currentBalance",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.currentBalance || "Current Balance"} />
      ),
      cell: ({ row }) => {
        return <span>{row.original.wallet?.currency} {row.original.wallet?.currentBalance?.toFixed(2)}</span>
      },
    },
    {
      accessorKey: "wallet.totalTopUps",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.totalTopUps || "Total Top-ups"} />
      ),
      cell: ({ row }) => {
        return <span>{row.original.wallet?.currency} {row.original.wallet?.totalTopUps?.toFixed(2)}</span>
      },
    },
    {
      accessorKey: "wallet.totalRefunds",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.totalRefunds || "Total Refunds"} />
      ),
      cell: ({ row }) => {
        return <span>{row.original.wallet?.currency} {row.original.wallet?.totalRefunds?.toFixed(2)}</span>
      },
    },
    {
      accessorKey: "wallet.totalPayments",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.totalPayments || "Total Payments"} />
      ),
      cell: ({ row }) => {
        return <span>{row.original.wallet?.currency} {row.original.wallet?.totalPayments?.toFixed(2)}</span>
      },
    },
    {
      accessorKey: "lastUpdated",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary?.tableColumnLabels?.lastUpdated || "Last Updated"} />
      ),
      cell: ({ row }) => {
        const date = row.getValue<string>("lastUpdated")
        return <span>{new Date(date).toLocaleString()}</span>
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{dictionary?.tableColumnLabels?.actions || "Actions"}</span>,
      cell: ({ row }) => (
        <InvoiceTableRowActions row={row as any} onStatusUpdate={onStatusUpdate} dictionary={dictionary} />
      ),
    }
  ]
