import { BadgePercent, HandCoins, Users } from "lucide-react"
import {
  DashboardOverviewCard,
} from "@/components/dashboards/dashboard-card"
import { DashboardPeriod } from "@/components/dashboards/services/dashboardService"

interface OverviewProps {
  data: any
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
  dictionary?: any
  user?: any
}

export function Overview({ data, period, onPeriodChange, dictionary, user }: OverviewProps) {
  const displayData = data;
  const userRole = user?.role as "ADMIN" | "STAFF" | "OWNER" | undefined
  const periodLabel = period === DashboardPeriod.WEEK ? dictionary?.analytics?.periods?.lastWeek || "Last week" : period === DashboardPeriod.YEAR ? dictionary?.analytics?.periods?.lastYear || "Last year" : dictionary?.analytics?.periods?.lastMonth || "Last month";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:col-span-2 lg:grid-cols-${userRole !== "ADMIN" ? 5 : 2} gap-4`}>
      <DashboardOverviewCard
        data={{ value: data?.bookingsRevenue || 0, percentageChange: 0 }}
        title={dictionary?.analytics?.overview?.bookingsRevenue || "Bookings Revenue"}
        period={periodLabel}
        icon={BadgePercent}
        formatStyle="currency"
      />
      {userRole !== "ADMIN" && (
        <>
          <DashboardOverviewCard
            data={{ value: data?.totalProfitShare || 0, percentageChange: 0 }}
            title={dictionary?.analytics?.overview?.totalProfitShare || "Total Profit Share"}
            period={periodLabel}
            icon={HandCoins}
            formatStyle="currency"
          />
          <DashboardOverviewCard
            data={{ value: data?.withdrawableAmount || 0, percentageChange: 0 }}
            title={dictionary?.analytics?.overview?.withdrawableAmount || "Withdrawable Amount"}
            period={periodLabel}
            icon={HandCoins}
            formatStyle="currency"
          />
          <DashboardOverviewCard
            data={{ value: data?.withdrawanAmount || 0, percentageChange: 0 }}
            title={dictionary?.analytics?.overview?.withdrawnAmount || "Withdrawn Amount"}
            period={periodLabel}
            icon={HandCoins}
            formatStyle="currency"
          />
        </>
      )}
      <DashboardOverviewCard
        data={{ value: data?.totalBookings || 0, percentageChange: 0 }}
        title={dictionary?.analytics?.overview?.totalBookings || "Total Bookings"}
        period={periodLabel}
        icon={Users}
      />
    </div>
  )
}
