"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DiamondPlus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { OwnerForm } from "@/app/[lang]/(dashboard-layout)/pages/court-owners/_components/ownerForm"

interface InvoiceTableToolbarProps<TTable> {
  table: Table<TTable>
  searchTerm: string
  setSearchTerm: (term: string) => void
  callback: () => void
  dictionary: any
}


export function InvoiceTableToolbar<TTable>({
  table,
  searchTerm,
  setSearchTerm,
  callback,
  dictionary
}: InvoiceTableToolbarProps<TTable>) {
  const [open, setOpen] = useState(false)

  const [inputValue, setInputValue] = useState(searchTerm)
  // const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined)

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setInputValue(value)

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }

      debounceTimeout.current = setTimeout(() => {
        setSearchTerm(value)
      }, 1000)
    },
    [setSearchTerm]
  )

  useEffect(() => {
    setInputValue(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])



  return (
    <>
      <div className="flex items-center gap-x-4">
        {/* OPEN MODAL BUTTON */}
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          aria-label="Add Owner"
          onClick={() => setOpen(true)}
        >
          <DiamondPlus className="h-4 w-4" />
        </Button>

        <Input
          placeholder={dictionary.search.search}
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          value={inputValue}
          onChange={handleChange}
          aria-label="Search..."
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Keep modal if needed or remove if not used */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg sm:max-w-lg max-h-[90vh] overflow-visible">
          <DialogHeader>
            <DialogTitle>{dictionary.inputDialogLabels.titleCreateOwner}</DialogTitle>
          </DialogHeader>

          <OwnerForm onClose={() => setOpen(false)} callback={callback} dictionary={dictionary} />
        </DialogContent>
      </Dialog>
    </>
  )
}
