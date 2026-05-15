
import { Card } from "@/components/ui/card"
import { RevenueTrendChart } from "./revenue-trend-chart"
import { RevenueTrendSummary } from "./revenue-trend-summary"

interface RevenueTrendProps {
  data: any
}

export function RevenueTrend({ data }: RevenueTrendProps) {
  return (
    <Card className="h-full min-h-[224px] flex flex-col justify-between gap-y-6 p-6">
      <RevenueTrendSummary 
        data={{ 
          totalRevenue: data?.totalRevenue || 0, 
          totalPercentageChange: 0 
        }} 
      />
      <RevenueTrendChart data={data?.revenueTrends || []} />
    </Card>
  )
}

