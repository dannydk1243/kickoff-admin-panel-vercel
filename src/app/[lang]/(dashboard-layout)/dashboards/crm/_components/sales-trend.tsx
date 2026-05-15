
import {
  DashboardCard,
} from "@/components/dashboards/dashboard-card"
import { BookingsTrendChart } from "./sales-trend-chart"
import { DashboardPeriod } from "@/components/dashboards/services/dashboardService"

interface BookingsTrendProps {
  data: any
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
}

export function BookingsTrend({ data, period, onPeriodChange }: BookingsTrendProps) {
  const periodLabel = period === DashboardPeriod.WEEK ? "Last week" : period === DashboardPeriod.YEAR ? "Last year" : "Last month";

  return (
    <DashboardCard
      title="Bookings Trend"
      period={periodLabel}
      className="col-span-full md:col-span-3"
    >
      <BookingsTrendChart data={data} />
    </DashboardCard>
  )
}
