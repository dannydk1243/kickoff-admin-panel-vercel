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
import { getAllAnnouncements, getAllBookings } from "@/components/dashboards/services/apiService"
import { getColumns } from "./columns"
import { InvoiceTableToolbar } from "./data-table-toolbar"

export function BookingDataTable() {
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
  const [data, setData] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0) // ✅ IMPORTANT
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | undefined>("")

  // Local status update
  const handleStatusUpdate = (
    bookingId: string,
    updates: { isBlocked: boolean; isDeleted: boolean, status?: string }
  ) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === bookingId ? { ...item, ...updates } : item
      )
    )
  }

  const columns = useMemo(
    () => getColumns(handleStatusUpdate, dictionary),
    [handleStatusUpdate]
  )

  const updateAnnouncementsList = async () => {
    const res = await getAllBookings(
      pagination.pageIndex + 1,
      pagination.pageSize,
      "MATCH"
    )
    if (res?.bookings) {
      setData(res.bookings)
      setTotalCount(res.total) // ✅ TOTAL ROWS
    }
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const page = pagination.pageIndex + 1
      const limit = pagination.pageSize

      const res = await getAllBookings(
        page,
        limit,
        "MATCH"
      )

      if (res?.bookings) {
        setData(res.bookings)
        setTotalCount(res.total) // ✅ TOTAL ROWS
      } else {
        setData([])
        setTotalCount(0)
      }

      setLoading(false)
    }

    fetchData()
  }, [pagination.pageIndex, pagination.pageSize])

  // React Table
  const table = useReactTable({
    data,
    columns,

    manualPagination: true, // ✅ SERVER SIDE PAGINATION
    rowCount: totalCount, // ✅ TOTAL FROM API

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
        <CardTitle>{dictionary.tableLabels.bookingDataTable}</CardTitle>
        <InvoiceTableToolbar
          table={table}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          callback={updateAnnouncementsList}
          dictionary={dictionary}
        />
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea
          orientation="horizontal"
          className="w-[calc(100vw-2.25rem)] md:w-auto"
        >
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {dictionary.tableLabels.noResults}
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
