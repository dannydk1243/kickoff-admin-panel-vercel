import { API } from "@/helpers"
import { toast } from "@/hooks/use-toast"
import { getAllBookings } from "./apiService"
import { DashboardAnalyticsType, BookingStatusType } from "@/app/[lang]/(dashboard-layout)/dashboards/crm/types"

export enum DashboardPeriod {
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export async function getDashboardOverview(period: DashboardPeriod = DashboardPeriod.MONTH, page: number = 1, limit: number = 5): Promise<DashboardAnalyticsType | null> {
  try {
    let periodString = period == DashboardPeriod.WEEK ? "WEEKLY" : period == DashboardPeriod.MONTH ? "MONTHLY" : "YEARLY"
    const res = await API.post(`bookings/analytics?by=${periodString}&page=${page}&limit=${limit}`)
    if (res?.status !== 200 && res?.status !== 201) return null
    return res.data
  } catch (error: any) {
    console.error("Error fetching overview stats:", error)
    return null
  }
}


export async function getBookingsTrend(period: DashboardPeriod = DashboardPeriod.MONTH) {
  try {
    const res = await API.post(`/dashboards/analytics/bookings-trend`, { period })
    if (res?.status !== 200 && res?.status !== 201) return null
    return res.data
  } catch (error: any) {
    console.error("Error fetching bookings trend:", error)
    return null
  }
}

export async function getRevenueTrend(period: DashboardPeriod = DashboardPeriod.MONTH) {
  try {
    const res = await API.post(`/dashboards/analytics/revenue-trend`, { period })
    if (res?.status !== 200 && res?.status !== 201) return null
    return res.data
  } catch (error: any) {
    console.error("Error fetching revenue trend:", error)
    return null
  }
}

export async function getLeadSources(period: DashboardPeriod = DashboardPeriod.MONTH) {
  try {
    const res = await API.post(`/dashboards/analytics/lead-sources`, { period })
    if (res?.status !== 200 && res?.status !== 201) return null
    return res.data
  } catch (error: any) {
    console.error("Error fetching lead sources:", error)
    return null
  }
}

export async function getLatestBookings(page: number = 1, limit: number = 5) {
  try {
    const res = await getAllBookings(page, limit, "MATCH", "")
    if (!res) return null

    const mappedBookings = res.bookings.map((b: any) => {
      // Normalize status: COMPLETED -> Completed
      const rawStatus = b.status || "Pending"
      const normalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()

      return {
        id: b._id,
        customerName: b.creator?.name || "Unknown",
        customerAvatar: b.creator?.avatar || "",
        courtName: b.court?.name || "Unknown",
        date: b.startDatetime,
        duration: b.durationMinutes,
        amount: b.finalAmount,
        status: normalizedStatus as BookingStatusType
      }
    })

    return {
      bookings: mappedBookings,
      total: res.total,
      page: res.page,
      limit: res.limit,
      pages: res.pages
    }
  } catch (error: any) {
    console.error("Error fetching latest bookings:", error)
    return null
  }
}

export async function getTopSellingCourts(period: DashboardPeriod = DashboardPeriod.MONTH) {
  try {
    const res = await API.post(`/dashboards/analytics/top-selling-courts`, { period })
    if (res?.status !== 200 && res?.status !== 201) return null
    return res.data
  } catch (error: any) {
    console.error("Error fetching top selling courts:", error)
    return null
  }
}
