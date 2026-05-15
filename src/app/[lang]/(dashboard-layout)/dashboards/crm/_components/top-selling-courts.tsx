import { topSellingCourtsData } from "../_data/top-selling-courts"
import {
  DashboardCard,
} from "@/components/dashboards/dashboard-card"
import { TopSellingCourtsList } from "./top-selling-courts-list"
import { DashboardPeriod } from "@/components/dashboards/services/dashboardService"

interface TopSellingCourtsProps {
  data: any
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
}

export function TopSellingCourts({ data, period, onPeriodChange }: TopSellingCourtsProps) {
  const periodLabel =
    period === DashboardPeriod.WEEK
      ? "Last week"
      : period === DashboardPeriod.YEAR
      ? "Last year"
      : "Last month"

  const courts = data || topSellingCourtsData

  return (
    <DashboardCard
      title="Top Selling Courts"
      period={periodLabel}
    >
      <TopSellingCourtsList data={courts} />
    </DashboardCard>
  )
}
