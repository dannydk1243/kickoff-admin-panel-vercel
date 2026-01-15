"use client"

import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimePickerProps {
  value: string | undefined
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function TimePicker({
  value,
  onValueChange,
  placeholder = "00:00",
  disabled,
}: TimePickerProps) {
  // Ensure we always have a string to split
  const [hours, minutes] = (value || "00:00").split(":")

  const updateTime = (newHours: string, newMins: string) => {
    onValueChange(`${newHours}:${newMins}`)
  }

  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  )
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  )

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          type="button"
          variant="outline"
          className={cn("w-full justify-between text-left font-normal")}
        >
          {value || (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <Clock className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[180px] p-3"
        align="start"
        // THIS PREVENTS AUTO-CLOSING
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div
          className="flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-1">
            <Select value={hours} onValueChange={(h) => updateTime(h, minutes)}>
              <SelectTrigger className="w-[70px] focus:ring-0">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[110]">
                {hourOptions.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="font-bold">:</span>

          <div className="flex flex-col gap-1">
            <Select
              value={minutes}
              onValueChange={(m) => updateTime(hours, m)}
            >
              <SelectTrigger className="w-[70px] focus:ring-0">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[110]">
                {minuteOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
