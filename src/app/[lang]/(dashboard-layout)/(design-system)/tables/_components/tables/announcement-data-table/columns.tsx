"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { InvoiceTableRowActions } from "./data-table-row-actions"

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
}

// Accept the handler and return columns array
export const getColumns = (
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean }) => void,
  dictionary: any
): ColumnDef<InvoiceTableRow>[] => [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.title} />
      ),
      cell: ({ row }) => {
        const title = row.getValue<string>("title")
        return <span className="text-primary">{title}</span>
      },
    },
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.id} />
      ),
      cell: ({ row }) => {
        const id = row.getValue<string>("_id")
        return <span>{id}</span>
      },
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.message} />
      ),
      cell: ({ row }) => {
        const message = row.getValue<string>("message")
        return <span>{message}</span>
      },
    },
    {
      accessorKey: "audience",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.recipients} />
      ),
      cell: ({ row }) => {
        const phone = row.getValue<string>("audience")
        return <span>{phone}</span>
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.sentOn} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue<string>("createdAt")
        return <span>{new Date(createdAt).toLocaleDateString()}</span>
      },
    },
  ]
