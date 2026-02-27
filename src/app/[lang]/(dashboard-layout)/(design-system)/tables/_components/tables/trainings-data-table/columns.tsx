"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { InvoiceType } from "../../../types"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { InvoiceTableRowActions } from "./data-table-row-actions"

type InvoiceTableRow = InvoiceType & {
  isBlocked: boolean
  isDeleted: boolean
  court: {
    name: string
  }
  creator: {
    name: string
  }
}

// Accept the handler and return columns array
export const getColumns = (
  onStatusUpdate: (id: string, updates: { isBlocked: boolean; isDeleted: boolean }) => void,
  dictionary: any
): ColumnDef<InvoiceTableRow>[] => [
    {
      accessorKey: "court.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.courtName} />
      ),
      cell: ({ row }) => {
        return <span>{row.original.court?.name}</span>
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
      accessorKey: "creator.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.creatorName} />
      ),
      cell: ({ row }) => {
        return <span>{row.original.creator?.name}</span>
      },
    },
    {
      accessorKey: "startDatetime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.startDatetime} />
      ),
      cell: ({ row }) => {
        const startDatetime = row.getValue<string>("startDatetime")
        return <span>{new Date(startDatetime).toLocaleString()}</span>
      },
    },
    {
      accessorKey: "endDatetime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.endDatetime} />
      ),
      cell: ({ row }) => {
        const endDatetime = row.getValue<string>("endDatetime")
        return <span>{new Date(endDatetime).toLocaleString()}</span>
      },
    },
    {
      accessorKey: "durationMinutes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.durationMinutes} />
      ),
      cell: ({ row }) => {
        const durationMinutes = row.getValue<number>("durationMinutes")
        return <span>{durationMinutes}</span>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dictionary.tableColumnLabels.status} />
      ),
      cell: ({ row }) => {
        const status = row.getValue<string>("status")
        return <span>{status}</span>
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
