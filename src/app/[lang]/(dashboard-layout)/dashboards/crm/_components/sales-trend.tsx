
import {
  DashboardCard,
} from "@/components/dashboards/dashboard-card"
import { BookingsTrendChart } from "./sales-trend-chart"
import { DashboardPeriod } from "@/components/dashboards/services/dashboardService"

interface BookingsTrendProps {
  data: any
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
  dictionary?: any
}

export function BookingsTrend({ data, period, onPeriodChange, dictionary }: BookingsTrendProps) {
  const periodLabel = period === DashboardPeriod.WEEK ? dictionary?.analytics?.periods?.lastWeek || "Last week" : period === DashboardPeriod.YEAR ? dictionary?.analytics?.periods?.lastYear || "Last year" : dictionary?.analytics?.periods?.lastMonth || "Last month";

  return (
    <DashboardCard
      title={dictionary?.analytics?.trends?.bookings || "Bookings Trend"}
      period={periodLabel}
      className="col-span-full md:col-span-3"
    >
      <BookingsTrendChart data={data} dictionary={dictionary} />
    </DashboardCard>
  )
}
