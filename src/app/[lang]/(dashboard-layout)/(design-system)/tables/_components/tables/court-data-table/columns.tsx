"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { InvoiceTableRowActions } from "./data-table-row-actions"

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
}

export const getColumns = (onStatusUpdate: (
  id: string,
  updates: { isBlocked: boolean; isDeleted: boolean }) => void,
  callback: any,
  dictionary: any
): ColumnDef<InvoiceTableRow>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.title} />
      ),
      cell: ({ row }) => (
        <span className="text-primary">
          {row.getValue<string>("name")}
        </span>
      ),
    },

    {
      accessorKey: "_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.courtId} />
      ),
      cell: ({ row }) => <span>{row.getValue<string>("_id")}</span>,
    },


    {
      accessorKey: "sport",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.sportType} />
      ),
      cell: ({ row }) => {
        const sport = row.getValue<string>("sport")
        return (
          <span>
            {sport
              ? sport.charAt(0).toUpperCase() +
              sport.slice(1).toLowerCase()
              : ""}
          </span>
        )
      },
    },

    {
      accessorKey: "location.city",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.area} />
      ),
      cell: ({ row }) => (
        <span>{row.original.location.city || "-"}</span>
      ),
    },

    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.priceHr} />
      ),
      cell: ({ row }) => <span>{row.getValue<number>("price")}</span>,
    },

    {
      accessorKey: "amenities",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.amenities} />
      ),
      cell: ({ row }) => (
        <span>{row.original.amenities.length}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.state} />
      ),
      cell: ({ row }) => {
        const status = row.getValue<string>("status")
        return (
          <span>
            {status}
          </span>
        )
      },
    },
    {
      id: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.status} />
      ),
      cell: ({ row }) => {
        const { isBlocked, isDeleted } = row.original
        // const { isBlocked, isDeleted } = row.original

        let status = "Active"
        let className = "text-green-600"

        if (isDeleted) {
          status = "Deleted"
          className = "text-gray-500"
        } else if (isBlocked) {
          status = "Blocked"
          className = "text-red-600"
        }

        return (
          <span className={`${className} inline-block min-w-[3vw]`}>
            {status}
          </span>
        )
      },
    },

    {
      id: "actions",
      header: () => <span className="sr-only">{dictionary.tableColumnLabels.actions}</span>,
      cell: ({ row }) => (
        <InvoiceTableRowActions
          row={row}
          onStatusUpdate={onStatusUpdate}
          callback={callback}
          dictionary={dictionary}
        />
      ),
    },
  ]

