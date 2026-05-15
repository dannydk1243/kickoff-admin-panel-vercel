import type { BookingsTrendType } from "../types"

export const bookingsTrendDataByPeriod: Record<"WEEK" | "MONTH" | "YEAR", BookingsTrendType> = {
  WEEK: {
    summary: {
      totalPending: 142,
      totalConfirmed: 98,
      totalCancelled: 54,
      totalCompleted: 38,
    },
    revenueTrends: [
      { label: "Mon", revenue: 5000 },
      { label: "Tue", revenue: 4500 },
      { label: "Wed", revenue: 6000 },
      { label: "Thu", revenue: 5500 },
      { label: "Fri", revenue: 7000 },
      { label: "Sat", revenue: 8000 },
      { label: "Sun", revenue: 4000 },
    ],
    totalRevenue: 40000,
  },
  MONTH: {
    summary: {
      totalPending: 620,
      totalConfirmed: 430,
      totalCancelled: 240,
      totalCompleted: 180,
    },
    revenueTrends: [
      { label: "Week 1", revenue: 30000 },
      { label: "Week 2", revenue: 35000 },
      { label: "Week 3", revenue: 28000 },
      { label: "Week 4", revenue: 42000 },
    ],
    totalRevenue: 135000,
  },
  YEAR: {
    summary: {
      totalPending: 2200,
      totalConfirmed: 1550,
      totalCancelled: 900,
      totalCompleted: 700,
    },
    revenueTrends: [
      { label: "Jan", revenue: 120000 },
      { label: "Feb", revenue: 110000 },
      { label: "Mar", revenue: 130000 },
      { label: "Apr", revenue: 125000 },
      { label: "May", revenue: 140000 },
      { label: "Jun", revenue: 135000 },
      { label: "Jul", revenue: 150000 },
      { label: "Aug", revenue: 145000 },
      { label: "Sep", revenue: 160000 },
      { label: "Oct", revenue: 170000 },
      { label: "Nov", revenue: 155000 },
      { label: "Dec", revenue: 180000 },
    ],
    totalRevenue: 1820000,
  },
}


// Default fallback (year — matches legacy export name)
export const bookingsTrendData: BookingsTrendType = bookingsTrendDataByPeriod.YEAR
