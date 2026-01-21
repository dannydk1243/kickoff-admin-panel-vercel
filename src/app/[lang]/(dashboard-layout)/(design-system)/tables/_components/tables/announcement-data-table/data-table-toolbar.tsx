"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Button, ButtonLoading } from "@/components/ui/button"
import { DiamondPlus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { useForm } from "react-hook-form"
import { NotificationObjectForm } from "@/app/[lang]/(dashboard-layout)/pages/account/settings/notifications/_components/general/notification-object-form"

interface InvoiceTableToolbarProps<TTable> {
  table: Table<TTable>
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedRole?: string
  setSelectedRole?: (role: string | undefined) => void
  callback?: () => void
}

interface ProfileInfoFormType {
  language?: string // Using "language" as the field name internally
}

export function InvoiceTableToolbar<TTable>({
  table,
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  callback
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

  // Form setup
  const form = useForm<ProfileInfoFormType>({
    defaultValues: {
      language: "",
    },
  })

  // const { isSubmitting, isDirty } = form.formState
  // const isDisabled = isSubmitting || !isDirty

  async function onSubmit(data: ProfileInfoFormType) {
    // Your submit logic here
  }

  // function handleResetForm() {
  //   form.reset()
  //   setSelectedRole(undefined)
  // }

  function handleResetForm() {
    form.reset()
    setSelectedRole?.("")
  }

  function handleResetFilters() {
    setInputValue("")
    setSearchTerm("")
    handleResetForm()
  }

  return (
    <>
      <div className="flex items-center gap-x-4">
        {/* OPEN MODAL BUTTON */}
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          aria-label="Send Notification"
          onClick={() => setOpen(true)}
        >
          <DiamondPlus className="h-4 w-4" />
        </Button>

        {/* <Input
          placeholder="Search..."
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          value={inputValue}
          onChange={handleChange}
          aria-label="Search..."
          spellCheck={false}
          autoComplete="off"
        /> */}

        {/* Inline Role Select Form */}
        {/* <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-x-2 max-w-sm"
          >
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="min-w-[150px]">
                  <FormLabel className="sr-only">Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedRole?.(value)
                      }}
                      value={selectedRole ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="OWNER">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.language?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </form>
        </Form> */}
        {/* <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button> */}
      </div>

      {/* Keep modal if needed or remove if not used */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-visible">
          <DialogHeader>
            <DialogTitle>Send Announcement</DialogTitle>
          </DialogHeader>

          <NotificationObjectForm onClose={() => setOpen(false)} callback={callback}/>
        </DialogContent>
      </Dialog>
    </>
  )
}
