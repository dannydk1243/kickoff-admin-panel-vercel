import type { RevenueTrendType } from "../types"

export const revenueTrendDataByPeriod: Record<"WEEK" | "MONTH" | "YEAR", RevenueTrendType> = {
  WEEK: {
    period: "Last week",
    summary: {
      totalRevenue: 22400,
      totalPercentageChange: 0.034,
    },
    revenueTrends: [
      { month: "Monday",    revenue: 3200 },
      { month: "Tuesday",   revenue: 2800 },
      { month: "Wednesday", revenue: 3500 },
      { month: "Thursday",  revenue: 3100 },
      { month: "Friday",    revenue: 3900 },
      { month: "Saturday",  revenue: 3400 },
      { month: "Sunday",    revenue: 2500 },
    ],
  },
  MONTH: {
    period: "Last month",
    summary: {
      totalRevenue: 68500,
      totalPercentageChange: 0.11,
    },
    revenueTrends: [
      { month: "Week 1", revenue: 15200 },
      { month: "Week 2", revenue: 16800 },
      { month: "Week 3", revenue: 18500 },
      { month: "Week 4", revenue: 18000 },
    ],
  },
  YEAR: {
    period: "2024",
    summary: {
      totalRevenue: 80000,
      totalPercentageChange: 0.25,
    },
    revenueTrends: [
      { month: "January",   revenue: 5000 },
      { month: "February",  revenue: 5500 },
      { month: "March",     revenue: 5000 },
      { month: "April",     revenue: 6000 },
      { month: "May",       revenue: 6500 },
      { month: "June",      revenue: 7000 },
      { month: "July",      revenue: 7250 },
      { month: "August",    revenue: 7250 },
      { month: "September", revenue: 6500 },
      { month: "October",   revenue: 6000 },
      { month: "November",  revenue: 7000 },
      { month: "December",  revenue: 8000 },
    ],
  },
}

// Default fallback (year)
export const revenueTrendData: RevenueTrendType = revenueTrendDataByPeriod.YEAR
