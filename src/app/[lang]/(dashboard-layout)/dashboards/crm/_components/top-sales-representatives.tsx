
import {
  DashboardCard,
} from "@/components/dashboards/dashboard-card"
import { TopSalesRepresentativesList } from "./top-sales-representatives-list"
import { DashboardPeriod } from "@/components/dashboards/services/dashboardService"

interface TopSalesRepresentativesProps {
  data: any
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
}

export function TopSalesRepresentatives({ data, period, onPeriodChange }: TopSalesRepresentativesProps) {
  const periodLabel = period === DashboardPeriod.WEEK ? "Last week" : period === DashboardPeriod.YEAR ? "Last year" : "Last month";
  const representatives = data?.representatives;

  return (
    <DashboardCard
      title="Top Sales Representatives"
      period={periodLabel}
    >
      <TopSalesRepresentativesList
        data={representatives}
      />
    </DashboardCard>
  )
}
