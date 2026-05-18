"use client"

import { useEffect, useState } from "react"
import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { LatestBookingsList } from "./latest-bookings-list"
import { getLatestBookings } from "@/components/dashboards/services/dashboardService"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function LatestBookings({ dictionary }: { dictionary?: any }) {
  const [data, setData] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      const res = await getLatestBookings(page, 5)
      if (res && res.bookings) {
        setData(res.bookings)
        setTotalPages(res.pages || 1)
      }
      setLoading(false)
    }
    fetchBookings()
  }, [page])

  return (
    <DashboardCard title={dictionary?.analytics?.latestBookings?.title || "Latest Bookings"} size="lg" period={dictionary?.analytics?.periods?.recentActivity || "Recent activity"}>
      <div className="flex flex-col h-full justify-between">
        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <span className="text-sm text-muted-foreground">{dictionary?.analytics?.latestBookings?.loading || "Loading..."}</span>
          </div>
        ) : (
          <LatestBookingsList data={data} dictionary={dictionary} />
        )}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> {dictionary?.analytics?.latestBookings?.previous || "Previous"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {dictionary?.analytics?.latestBookings?.pageOf
                ? dictionary.analytics.latestBookings.pageOf.replace('{page}', page.toString()).replace('{totalPages}', totalPages.toString())
                : `Page ${page} of ${totalPages}`
            }
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            {dictionary?.analytics?.latestBookings?.next || "Next"} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </DashboardCard>
  )
}
