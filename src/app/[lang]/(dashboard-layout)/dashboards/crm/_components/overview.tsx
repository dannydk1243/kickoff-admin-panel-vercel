import { BadgePercent, HandCoins, Users } from "lucide-react"
import {
  DashboardOverviewCard,
} from "@/components/dashboards/dashboard-card"
import { DashboardPeriod } from "@/components/dashboards/services/dashboardService"

interface OverviewProps {
  data: any
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
}

export function Overview({ data, period, onPeriodChange }: OverviewProps) {
  const displayData = data;

  const periodLabel = period === DashboardPeriod.WEEK ? "Last week" : period === DashboardPeriod.YEAR ? "Last year" : "Last month";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:col-span-2 lg:grid-cols-5 gap-4">
      <DashboardOverviewCard
        data={{ value: data?.bookingsRevenue || 0, percentageChange: 0 }}
        title="Bookings Revenue"
        period={periodLabel}
        icon={BadgePercent}
        formatStyle="currency"
      />
      <DashboardOverviewCard
        data={{ value: data?.totalProfitShare || 0, percentageChange: 0 }}
        title="Total Profit Share"
        period={periodLabel}
        icon={HandCoins}
        formatStyle="currency"
      />
      <DashboardOverviewCard
        data={{ value: data?.withdrawableAmount || 0, percentageChange: 0 }}
        title="Withdrawable Amount"
        period={periodLabel}
        icon={HandCoins}
        formatStyle="currency"
      />
      <DashboardOverviewCard
        data={{ value: data?.withdrawanAmount || 0, percentageChange: 0 }}
        title="Withdrawn Amount"
        period={periodLabel}
        icon={HandCoins}
        formatStyle="currency"
      />
      <DashboardOverviewCard
        data={{ value: data?.totalBookings || 0, percentageChange: 0 }}
        title="Total Bookings"
        period={periodLabel}
        icon={Users}
      />
    </div>
  )
}
