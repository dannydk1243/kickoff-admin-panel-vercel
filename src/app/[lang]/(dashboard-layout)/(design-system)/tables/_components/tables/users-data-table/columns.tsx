"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { InvoiceTableRowActions } from "./data-table-row-actions"

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
  isVerified: boolean
  deletedByAdmin?: boolean
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
        return <span className="text-primary">{name || "N/A"}</span>
      },
    },
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const id = row.getValue<string>("_id")
        return <span>{id || "N/A"}</span>
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const email = row.getValue<string>("email")
        return <span>{email || "N/A"}</span>
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone Number" />
      ),
      cell: ({ row }) => {
        const phone = row.getValue<string>("phone")
        return <span>{phone || "N/A"}</span>
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Registration Date" />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue<string>("createdAt")
        return <span>{new Date(createdAt).toLocaleDateString() || "N/A"}</span>
      },
    },
    {
      accessorKey: "createdA",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last active date" />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue<string>("createdAt")
        return <span>{new Date(createdAt).toLocaleDateString() || "N/A"}</span>
      },
    },
    // {
    //   accessorKey: "created",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Total bookings" />
    //   ),
    //   cell: ({ row }) => {
    //     const createdAt = row.getValue<string>("createdAt")
    //     return <span>{createdAt?.split("-")[0] || "N/A"}</span>
    //   },
    // },


    {
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const { isBlocked, isDeleted, deletedByAdmin } = row.original

        let status = "Active"
        let className = "text-green-600"

        // ✅ Deleted has highest priority
        if (isDeleted || deletedByAdmin) {
          status = "Deleted"
          className = "text-gray-500"
        } else if (isBlocked) {
          status = "Blocked"
          className = "text-red-600"
        }

        return (
          <span className={`${className} inline-block min-w-[3vw] `}>
            {status}
          </span>
        )
      },
    },
    {
      id: 'isVerified',
       header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Verification" />
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
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <InvoiceTableRowActions row={row} onStatusUpdate={onStatusUpdate} />
      ),
    }
  ]
