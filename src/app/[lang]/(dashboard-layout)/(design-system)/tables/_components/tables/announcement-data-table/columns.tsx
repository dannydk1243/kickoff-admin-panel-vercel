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
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean }) => void
): ColumnDef<InvoiceTableRow>[] => [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const title = row.getValue<string>("title")
        return <span className="text-primary">{title}</span>
      },
    },
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const id = row.getValue<string>("_id")
        return <span>{id}</span>
      },
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => {
        const message = row.getValue<string>("message")
        return <span>{message}</span>
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Recipients" />
      ),
      cell: ({ row }) => {
        const phone = row.getValue<string>("type")
        return <span>{phone}</span>
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sent On" />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue<string>("createdAt")
        return <span>{new Date(createdAt).toLocaleDateString()}</span>
      },
    },
  ]
