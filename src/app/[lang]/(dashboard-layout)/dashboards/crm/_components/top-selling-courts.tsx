import { useEffect, useState } from "react"
import { topSellingCourtsData } from "../_data/top-selling-courts"
import {
  DashboardCard,
} from "@/components/dashboards/dashboard-card"
import { TopSellingCourtsList } from "./top-selling-courts-list"
import { DashboardPeriod, getDashboardOverview } from "@/components/dashboards/services/dashboardService"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TopSellingCourtsProps {
  data: any
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
  dictionary?: any
}

export function TopSellingCourts({ data, period, onPeriodChange, dictionary }: TopSellingCourtsProps) {
  const periodLabel =
    period === DashboardPeriod.WEEK
      ? dictionary?.analytics?.periods?.lastWeek || "Last week"
      : period === DashboardPeriod.YEAR
        ? dictionary?.analytics?.periods?.lastYear || "Last year"
        : dictionary?.analytics?.periods?.lastMonth || "Last month"

  const [page, setPage] = useState<number>(data?.page || 1)
  const [totalPages, setTotalPages] = useState<number>(data?.pages || 1)
  const [courts, setCourts] = useState<any[]>(data?.courts || topSellingCourtsData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data) {
      setCourts(data.courts || topSellingCourtsData)
      setTotalPages(data.pages || 1)
      setPage(data.page || 1)
    }
  }, [data])

  useEffect(() => {
    if (!data || page === (data.page || 1)) return

    const fetchCourtsPage = async () => {
      setLoading(true)
      const res = await getDashboardOverview(period, page, data.limit || 15)
      if (res) {
        setCourts(res.courts || [])
        setTotalPages(res.pages || 1)
      }
      setLoading(false)
    }

    fetchCourtsPage()
  }, [page, period, data])

  return (
    <DashboardCard
      title={dictionary?.analytics?.topSellingCourts?.title || "Top Selling Courts"}
      size="lg"
      period={periodLabel}
    >
      <div className="flex flex-col h-full justify-between">
        <TopSellingCourtsList data={courts} dictionary={dictionary} />
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> {dictionary?.analytics?.topSellingCourts?.previous || "Previous"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {dictionary?.analytics?.topSellingCourts?.pageOf
                ? dictionary.analytics.topSellingCourts.pageOf.replace('{page}', page.toString()).replace('{totalPages}', totalPages.toString())
                : `Page ${page} of ${totalPages}`
            }
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            {dictionary?.analytics?.topSellingCourts?.next || "Next"} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </DashboardCard>
  )
}
