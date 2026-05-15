import type { LatestBookingType, BookingStatusType } from "../types"

import { cn, formatCurrency, formatDateWithTime, getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const statusStyles: Record<BookingStatusType, string> = {
  Confirmed:  "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  Completed:  "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  Cancelled:  "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
  Pending:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
}

export function LatestBookingsItem({ booking }: { booking: LatestBookingType }) {
  return (
    <li className="flex items-center gap-3 py-2.5 px-4 bg-card border rounded-lg">
      {/* Avatar */}
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={booking.customerAvatar} alt={booking.customerName} />
        <AvatarFallback>{getInitials(booking.customerName)}</AvatarFallback>
      </Avatar>

      {/* Customer + Court */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{booking.customerName}</p>
        <p className="text-xs text-muted-foreground truncate">{booking.courtName} · {booking.duration} min</p>
      </div>

      {/* Date */}
      <p className="hidden sm:block text-xs text-muted-foreground whitespace-nowrap">
        {formatDateWithTime(booking.date)}
      </p>

      {/* Amount + Status */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-semibold">{formatCurrency(booking.amount)}</span>
        <Badge className={cn("text-[10px] px-1.5 py-0 border-0", statusStyles[booking.status])}>
          {booking.status}
        </Badge>
      </div>
    </li>
  )
}
