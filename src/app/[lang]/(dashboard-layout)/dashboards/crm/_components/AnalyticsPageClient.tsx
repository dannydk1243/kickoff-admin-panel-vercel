"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useEffect, useState } from "react"

import { LatestBookings } from "./latest-bookings"
import { Overview } from "./overview"
import { RevenueTrend } from "./revenue-trend"
import { BookingsTrend } from "./sales-trend"
import { TopSellingCourts } from "./top-selling-courts"
import {
  DashboardPeriod,
  getDashboardOverview,
  getBookingsTrend,
  getRevenueTrend,
  getLeadSources,
  getTopSellingCourts
} from "@/components/dashboards/services/dashboardService"
import { overviewDataByPeriod } from "../_data/overview"
import { bookingsTrendDataByPeriod } from "../_data/sales-trend"
import { revenueTrendDataByPeriod } from "../_data/revenue-trend"
import { leadSourcesDataByPeriod } from "../_data/lead-sources"
import { latestBookingsData } from "../_data/latest-bookings"
import { topSellingCourtsDataByPeriod } from "../_data/top-selling-courts"

export function AnalyticsPageClient({ dictionary, user }: { dictionary: any, user: any }) {
  const [period, setPeriod] = useState<DashboardPeriod>(DashboardPeriod.YEAR)
  const [overviewData, setOverviewData] = useState<any>(null)
  const [bookingsTrendData, setBookingsTrendData] = useState<any>(null)
  const [revenueTrendData, setRevenueTrendData] = useState<any>(null)
  const [leadSourcesData, setLeadSourcesData] = useState<any>(null)
  const [topCourts, setTopCourts] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async (newPeriod: DashboardPeriod) => {
    setLoading(true)
    try {
      const data = await getDashboardOverview(newPeriod)
      if (data) {
        setOverviewData(data)
        setBookingsTrendData(data.bookingTrend)
        setRevenueTrendData(data.bookingTrend)
        setTopCourts(data)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData(period)
  }, [period])

  const handlePeriodChange = (newPeriod: DashboardPeriod) => {
    setPeriod(newPeriod)
  }

  // Resolve period-aware fallback mock data
  const periodKey = period as "WEEK" | "MONTH" | "YEAR"
  const fallbackOverview = overviewDataByPeriod[periodKey]
  const fallbackBookings = bookingsTrendDataByPeriod[periodKey]
  const fallbackRevenue = revenueTrendDataByPeriod[periodKey]
  const fallbackLeads = leadSourcesDataByPeriod[periodKey]
  const fallbackTopCourts = topSellingCourtsDataByPeriod[periodKey]

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between container">
        <h2 className="text-2xl font-bold tracking-tight">{dictionary.analytics?.title || "Analytics"}</h2>
        <Select

          value={period}
          onValueChange={(value) => handlePeriodChange(value as DashboardPeriod)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={dictionary.analytics?.periods?.selectPeriod || "Select period"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DashboardPeriod.WEEK}>{dictionary.analytics?.periods?.lastWeek || "Last week"}</SelectItem>
            <SelectItem value={DashboardPeriod.MONTH}>{dictionary.analytics?.periods?.lastMonth || "Last month"}</SelectItem>
            <SelectItem value={DashboardPeriod.YEAR}>{dictionary.analytics?.periods?.lastYear || "Last year"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section className="container grid gap-4 md:grid-cols-2">
        <Overview
          data={overviewData || fallbackOverview}
          period={period}
          onPeriodChange={handlePeriodChange}
          dictionary={dictionary}
          user={user}
        />

        <div className="col-span-full grid gap-4 md:grid-cols-4">
          <BookingsTrend
            data={bookingsTrendData || fallbackBookings}
            period={period}
            onPeriodChange={handlePeriodChange}
            dictionary={dictionary}
          />
          <RevenueTrend 
            data={revenueTrendData || fallbackRevenue} 
            dictionary={dictionary}
          />
          {/* <LeadSources data={leadSourcesData || fallbackLeads} /> */}
        </div>

        <LatestBookings dictionary={dictionary} />
        <TopSellingCourts
          data={topCourts || fallbackTopCourts}
          period={period}
          onPeriodChange={handlePeriodChange}
          dictionary={dictionary}
        />
      </section>
    </div>
  )
}
