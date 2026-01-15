import { useState, useEffect, useRef, useCallback } from "react"
import type { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

interface InvoiceTableToolbarProps<TTable> {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

/**
 * InvoiceTableToolbar with debounced search input.
 * Debounces the `setSearchTerm` callback by 1 second after user stops typing.
 */
export function InvoiceTableToolbar<TTable>({
  searchTerm,
  setSearchTerm,
}: InvoiceTableToolbarProps<TTable>) {
  // Local input state to update immediately on user typing
  const [inputValue, setInputValue] = useState(searchTerm)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // On input change, update local state immediately
  // and debounce updating the external searchTerm state
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

  // If external searchTerm changes (e.g., reset), sync local input
  useEffect(() => {
    setInputValue(searchTerm)
  }, [searchTerm])

  // Clear timeout on unmount to prevent setting state on unmounted component
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  return (
    <div className="flex gap-x-1.5">
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
  )
}
