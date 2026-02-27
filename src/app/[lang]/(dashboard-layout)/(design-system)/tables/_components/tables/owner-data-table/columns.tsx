"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { InvoiceTableRowActions } from "./data-table-row-actions"

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
  isVerified: boolean
  email: string
}

// Accept the handler and return columns array
export const getColumns = (
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean }) => void,
  dictionary: any
): ColumnDef<InvoiceTableRow>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.name} />
      ),
      cell: ({ row }) => {
        const name = row.getValue<string>("name")
        return <span className="text-primary">{name}</span>
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
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.email} />
      ),
      cell: ({ row }) => {
        const email = row.getValue<string>("email")
        return <span>{email}</span>
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.phoneNumber} />
      ),
      cell: ({ row }) => {
        const phone = row.getValue<string>("phone")
        return <span>{phone}</span>
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.registrationDate} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue<string>("createdAt")
        return <span>{new Date(createdAt).toLocaleDateString()}</span>
      },
    },

    {
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.status} />
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
          className={`${className} inline-block min-w-[3vw]`}
        >
          {status}
        </span>
      },
    },
    {
      id: 'isVerified',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.verification} />
      ),
      cell: ({ row }) => {
        const { isVerified } = row.original

        let status = "Verified"
        let className = "text-green-600"

        if (!isVerified) {
          status = "Unverified"
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
      header: () => <span className="sr-only">{dictionary.tableColumnLabels.actions}</span>,
      cell: ({ row }) => (
        <InvoiceTableRowActions row={row} onStatusUpdate={onStatusUpdate} dictionary={dictionary} />
      ),
    }
  ]
