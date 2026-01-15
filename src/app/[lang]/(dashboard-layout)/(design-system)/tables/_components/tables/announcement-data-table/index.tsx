"use client";

import { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getColumns } from "./columns";
import { InvoiceTableToolbar } from "./data-table-toolbar";
import { getAllAnnouncements } from "@/components/dashboards/services/apiService";
import { useTranslation } from "@/lib/translationContext";

export function AnnouncementDataTable() {
  const dictionary: any = useTranslation();
  
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  // Data state
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0); // ✅ IMPORTANT
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | undefined>("")


  // Local status update
  const handleStatusUpdate = (
    adminId: string,
    updates: { isBlocked: boolean; isDeleted: boolean }
  ) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === adminId ? { ...item, ...updates } : item
      )
    );
  };

  const columns = useMemo(
    () => getColumns(handleStatusUpdate),
    [handleStatusUpdate]
  );

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const page = pagination.pageIndex + 1;
      const limit = pagination.pageSize;

      const res = await getAllAnnouncements(page, limit, searchTerm, selectedRole);

      if (res?.announcements) {
        setData(res.announcements);
        setTotalCount(res.total); // ✅ TOTAL ROWS
      } else {
        setData([]);
        setTotalCount(0);
      }

      setLoading(false);
    };

    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

  // React Table
  const table = useReactTable({
    data,
    columns,

    manualPagination: true, // ✅ SERVER SIDE PAGINATION
    rowCount: totalCount,   // ✅ TOTAL FROM API

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
  });

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center gap-x-1.5 space-y-0">
        <CardTitle>{dictionary.tableLabels.announcementDataTable}</CardTitle>
        <InvoiceTableToolbar table={table} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
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
  );
}
