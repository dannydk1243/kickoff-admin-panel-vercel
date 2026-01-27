"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import type { ComponentProps } from "react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DateRangePickerProps = Omit<
  ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect" | "disabled"
> & {
  value?: DateRange
  onValueChange?: (date?: DateRange) => void
  excludeRanges?: DateRange[]
  formatStr?: string
  popoverContentClassName?: string
  popoverContentOptions?: ComponentProps<typeof PopoverContent>
  buttonClassName?: string
  buttonOptions?: ComponentProps<typeof Button>
  placeholder?: string
  pickerDisabled?: boolean
}

export function DateRangePicker({
  value,
  onValueChange,
  excludeRanges = [],
  formatStr = "yyyy-MM-dd",
  popoverContentClassName,
  popoverContentOptions,
  buttonClassName,
  buttonOptions,
  placeholder = "Pick date range",
  pickerDisabled = false,
  ...props
}: DateRangePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // normalize today to midnight

  const defaultValue: DateRange = {
    from: today,
    to: today,
  }

  const selectedRange = value ?? defaultValue

  // Disable all dates before today
  const disabled = [
    { before: today },
    ...excludeRanges
      .map((range) => ({
        from: range.from,
        to: range.to,
      }))
      .filter((range) => range.from && range.to), // Only exclude complete ranges
  ]

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          disabled = {pickerDisabled}
          variant="outline"
          className={cn("w-full px-3 text-start font-normal", buttonClassName)}

          {...buttonOptions}
        >
          {selectedRange.from ? (
            selectedRange.to ? (
              <span>
                {format(selectedRange.from, formatStr)} to{" "}
                {format(selectedRange.to, formatStr)}
              </span>
            ) : (
              <span>{format(selectedRange.from, formatStr)}</span>
            )
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <CalendarIcon className="ms-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0", popoverContentClassName)}
        align="start"
        {...popoverContentOptions}
      >
        <Calendar
          mode="range"
          selected={value}
          onSelect={onValueChange}
          disabled={disabled} // Passes the array of rules to react-day-picker
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}
