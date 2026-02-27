"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Cookies from "js-cookie"

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CourtForm } from "@/app/[lang]/(dashboard-layout)/pages/courts/_components/courtForm"
import { getAllCourts } from "@/components/dashboards/services/apiService"
import { getColumns } from "./columns"
import { InvoiceTableToolbar } from "./data-table-toolbar"
import { useTranslation } from "@/lib/translationContext"

export function CourtDataTable() {
  const [open, setOpen] = useState(false)
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

  const pathname = usePathname()

  // Local status update
  const handleStatusUpdate = (
    courtId: string,
    updates: { isBlocked: boolean; isDeleted: boolean }
  ) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === courtId ? { ...item, ...updates } : item
      )
    )
  }



  let pathUrl: any = pathname?.split("/").pop()

  const [paramId, setParamId] = useState<string>("")
  const searchParams = useSearchParams()

  useEffect(() => {
    let val = searchParams.get("id")
    setParamId(val ?? "")
    const timer = setTimeout(() => {
      if (val) {
        setTimeout(() => setOpen(true), 0)
      }
    }, 2000)

    // CLEANUP: This kills the timer if the component unmounts
    return () => clearTimeout(timer)
  }, [searchParams])

  const updateCourtsList = async () => {
    const value = Cookies.get("adminProfile") ?? ""
    const adminData = JSON.parse(value)
    const res = await getAllCourts(
      pagination.pageIndex + 1,
      pagination.pageSize,
      searchTerm,
      adminData.role
    )
    if (res?.courts) {
      setData(res?.courts)
      setTotalCount(res?.total) // ✅ TOTAL ROWS
    }
  }

  const columns = useMemo(
    () => getColumns(handleStatusUpdate, updateCourtsList, dictionary),
    [handleStatusUpdate]
  )
  // Fetch data
  useEffect(() => {
    const value = Cookies.get("adminProfile") ?? ""
    const adminData = JSON.parse(value)

    const fetchData = async () => {
      setLoading(true)

      const page = pagination.pageIndex + 1
      const limit = pagination.pageSize

      const res = await getAllCourts(page, limit, searchTerm, adminData.role)

      if (res?.courts) {
        setData(res?.courts)
        setTotalCount(res?.total) // ✅ TOTAL ROWS
      } else {
        setData([])
        setTotalCount(0)
      }

      setLoading(false)
    }

    fetchData()
  }, [pagination.pageIndex, pagination.pageSize, searchTerm])

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
    <div>
      <Card>
        <CardHeader className="flex-row justify-between items-center gap-x-1.5 space-y-0">
          <CardTitle>{dictionary.tableLabels.courtsDataTable}</CardTitle>
          <InvoiceTableToolbar
            table={table}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            callback={updateCourtsList}
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
                    {headerGroup.headers.map((header, index) => (
                      <TableHead key={index}>
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
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell key={index}>
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
                      No results.
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg sm:max-w-[65vw] max-h-[98vh] overflow-visible">
          <CourtForm
            onClose={() => setOpen(false)}
            courtId={paramId}
            view={paramId != null && paramId != ""}
            callback={updateCourtsList}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
