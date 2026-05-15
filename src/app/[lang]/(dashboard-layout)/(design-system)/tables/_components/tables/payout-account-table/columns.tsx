"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { PayoutAccountTableRowActions } from "./data-table-row-actions"

export type PayoutAccountRow = {
  _id: string
  type: string
  bank?: string
  wallet?: string
  properties: any
  credentials: any
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const getColumns = (
  onStatusUpdate: (id: string, updates: any) => void,
  onEdit: (account: PayoutAccountRow) => void,
  dictionary: any
): ColumnDef<PayoutAccountRow>[] => [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary?.payoutAccount?.type || "Type"} />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant="outline">
          {dictionary?.payoutAccount?.types?.[type] || type}
        </Badge>
      )
    },
  },
  {
    id: "account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary?.payoutAccount?.bank || "Account"} />
    ),
    cell: ({ row }) => {
      const { bank, wallet } = row.original
      const name = bank 
        ? (dictionary?.payoutAccount?.banks?.[bank] || bank) 
        : (dictionary?.payoutAccount?.wallets?.[wallet as string] || wallet)
      return <span className="font-medium">{name}</span>
    },
  },
  {
    id: "identifier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary?.payoutAccount?.iban || "Identifier"} />
    ),
    cell: ({ row }) => {
      const { properties } = row.original
      const identifier = properties?.iban || properties?.merchant_id || "-"
      return <span className="font-mono text-xs">{identifier}</span>
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary?.payoutAccount?.status || "Status"} />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? (dictionary?.userWallet?.active || "Active") : (dictionary?.userWallet?.inactive || "Inactive")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary?.payoutAccount?.created || "Created"} />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      return <span className="font-medium text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <PayoutAccountTableRowActions 
        row={row as any} 
        onStatusUpdate={onStatusUpdate} 
        onEdit={onEdit}
        dictionary={dictionary} 
      />
    ),
  },
]
