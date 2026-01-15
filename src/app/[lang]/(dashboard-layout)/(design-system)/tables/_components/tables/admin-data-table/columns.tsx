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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.getValue<string>("name")
        return <span className="text-primary">{name}</span>
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
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const email = row.getValue<string>("email")
        return <span>{email}</span>
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone Number" />
      ),
      cell: ({ row }) => {
        const phone = row.getValue<string>("phone")
        return <span>{phone}</span>
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Registration Date" />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue<string>("createdAt")
        return <span>{new Date(createdAt).toLocaleDateString()}</span>
      },
    },

    {
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const { isBlocked, isDeleted } = row.original

        let status = "Active"
        let className = "text-green-600"

        if (isDeleted) {
          status = "Deleted"
          className = "text-gray-500"
        } else if (isBlocked) {
          status = "Blocked"
          className = "text-red-600"
        }

        return <span
          className={`${className}  inline-block min-w-[3vw]`}
        >
          {status}
        </span>
      },
    },

    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <InvoiceTableRowActions row={row} onStatusUpdate={onStatusUpdate} />
      ),
    }
  ]
