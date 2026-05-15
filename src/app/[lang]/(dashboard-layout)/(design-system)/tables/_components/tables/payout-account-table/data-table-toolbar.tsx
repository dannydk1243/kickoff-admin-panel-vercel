"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PayoutAccountTableToolbarProps<TData> {
  table: Table<TData>
  searchTerm: string
  setSearchTerm: (value: string) => void
  dictionary: any
}

export function PayoutAccountTableToolbar<TData>({
  table,
  searchTerm,
  setSearchTerm,
  dictionary,
}: PayoutAccountTableToolbarProps<TData>) {
  const isFiltered = searchTerm.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={dictionary?.search?.search || "Search..."}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => setSearchTerm("")}
            className="h-8 px-2 lg:px-3"
          >
            {dictionary?.rowControlLabels?.reset || "Reset"}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
