"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Cookies from "js-cookie"
import { DiamondPlus } from "lucide-react"

import type { Table } from "@tanstack/react-table"

import { Button, ButtonLoading } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CourtCustomModal } from "@/app/[lang]/(dashboard-layout)/pages/courts/_components/courtCustomModal"
import { CourtForm } from "@/app/[lang]/(dashboard-layout)/pages/courts/_components/courtForm"
import { getOnlyOwners } from "@/components/dashboards/services/apiService"

interface InvoiceTableToolbarProps<TTable> {
  table: Table<TTable>
  searchTerm: string
  setSearchTerm: (term: string) => void
  callback:() => void
}

interface ProfileInfoFormType {
  language?: string // Using "language" as the field name internally
}

export function InvoiceTableToolbar<TTable>({
  table,
  searchTerm,
  setSearchTerm,
  callback
}: InvoiceTableToolbarProps<TTable>) {
  const [open, setOpen] = useState(false)

  const [inputValue, setInputValue] = useState(searchTerm)
  const [selectedOwner, setSelectedOwner] = useState("");
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

  useEffect(() => {
    //   const fetchData = async () => {
    //     // setLoading(true);
    //     const res = await getOnlyOwners();
    //     if (res?.admins) {
    //       setAllOwnersList(res.admins);
    //       // setTotalCount(res.pagination.total); // ✅ TOTAL ROWS
    //     } else {
    //       setAllOwnersList([]);
    //       // setTotalCount(0);
    //     }
    //   };
    //   fetchData();
    const value = Cookies.get("adminProfile") ?? ""
    let adminData = JSON.parse(value)
    setSelectedOwner(adminData._id);
  }, [])

  return (
    <>
      <div className="flex items-center gap-x-4">
        {/* OPEN MODAL BUTTON */}
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          aria-label="Add Court"
          onClick={() => setOpen(true)}
        >
          <DiamondPlus className="h-4 w-4" />
        </Button>

        <Input
          placeholder="Search..."
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
        <DialogContent className="max-w-lg sm:max-w-[65vw] max-h-[98vh] overflow-visible">
          <CourtForm onClose={() => setOpen(false)} selectedOwner={selectedOwner} setSelectedOwner={setSelectedOwner} courtId={""} view={false} callback={callback}/>
        </DialogContent>
      </Dialog>

      {/* <CourtCustomModal open={open} onCancel={() => setOpen(false)}>
        <CourtForm onClose={() => setOpen(false)} courtId={""} />
      </CourtCustomModal> */}
    </>
  )
}
