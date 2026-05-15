"use client"

import { useEffect, useMemo, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"

import { useTranslation } from "@/lib/translationContext"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getMyPayoutAccount } from "@/components/dashboards/services/payoutAccountService"
import { getColumns, PayoutAccountRow } from "./columns"
import { PayoutAccountTableToolbar } from "./data-table-toolbar"

interface PayoutAccountDataTableProps {
  onAdd: () => void
  onEdit: (account: PayoutAccountRow) => void
  refreshSignal: number
}

export function PayoutAccountDataTable({ onAdd, onEdit, refreshSignal }: PayoutAccountDataTableProps) {
  const dictionary: any = useTranslation()

  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  })

  // Data state
  const [data, setData] = useState<PayoutAccountRow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleStatusUpdate = (id: string, updates: any) => {
    if (updates.isDeleted) {
      setData((prev) => prev.filter((item) => item._id !== id))
      setTotalCount((prev) => prev - 1)
    } else {
      setData((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updates } : item))
      )
    }
  }

  const columns = useMemo(
    () => getColumns(handleStatusUpdate, onEdit, dictionary),
    [onEdit, dictionary]
  )

  const fetchData = async () => {
    setLoading(true)
    const res = await getMyPayoutAccount()

    if (res) {
      setData([res])
      setTotalCount(1)
    } else {
      setData([])
      setTotalCount(0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize, searchTerm, refreshSignal])

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    rowCount: totalCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center gap-x-1.5 space-y-0">
        <CardTitle>{dictionary?.payoutAccount?.title || "Payout Accounts"}</CardTitle>
        <div className="flex items-center gap-2">
          <PayoutAccountTableToolbar
            table={table}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dictionary={dictionary}
          />
          <Button size="sm" onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary?.payoutAccount?.addAccount || "Add Account"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea orientation="horizontal" className="w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {dictionary?.navigation?.loading || "Loading..."}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {dictionary?.tableLabels?.noResults || "No results."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      <CardFooter className="block py-3">
        <DataTablePagination table={table} />
      </CardFooter>
    </Card>
  )
}
