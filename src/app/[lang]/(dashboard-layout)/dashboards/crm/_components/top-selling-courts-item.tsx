import type { TopSellingCourtType } from "../types"

import { cn, formatCurrency } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"

const rankColors = [
  "bg-yellow-400 dark:bg-yellow-500",
  "bg-gray-300  dark:bg-gray-400",
  "bg-amber-600 dark:bg-amber-700",
]

export function TopSellingCourtsItem({ 
  court, 
  rank 
}: { 
  court: TopSellingCourtType; 
  rank: number 
}) {
  const isTop3 = rank <= 3

  return (
    <li>
      <Card>
        <CardContent className="flex items-center gap-x-4 py-3 px-5">
          {/* Rank badge */}
          <div
            className={cn(
              "size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white",
              isTop3 ? rankColors[rank - 1] : "bg-muted text-foreground"
            )}
          >
            {rank}
          </div>

          {/* Court info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{court.name}</p>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <Badge>{formatCurrency(court.revenue)}</Badge>
            <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60">{court.bookings} bookings</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </li>
  )
}

