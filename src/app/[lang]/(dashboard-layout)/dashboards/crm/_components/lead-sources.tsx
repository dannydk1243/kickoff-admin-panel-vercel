
import { Card } from "@/components/ui/card"
import { LeadSourcesChart } from "./lead-sources-chart"

interface LeadSourcesProps {
  data: any
}

export function LeadSources({ data }: LeadSourcesProps) {
  const displayData = data;
  return (
    <Card className="h-56 p-6">
      <LeadSourcesChart
        data={{
          leads: displayData.leads,
          summary: displayData.summary,
        }}
      />
    </Card>
  )
}
