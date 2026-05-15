import { activeProjectsData } from "../_data/active-projects"
import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { ActiveProjectsList } from "./active-projects-list"

interface ActiveProjectsProps {
  data: any
}

export function ActiveProjects({ data }: ActiveProjectsProps) {
  const displayData = data || activeProjectsData;
  return (
    <DashboardCard title="Active Projects" size="lg">
      <ActiveProjectsList data={displayData} />
    </DashboardCard>
  )
}
