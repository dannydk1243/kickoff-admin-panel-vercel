import type { OverviewType } from "../types"

export const overviewDataByPeriod: Record<"WEEK" | "MONTH" | "YEAR", OverviewType> = {
  WEEK: {
    bookingsRevenue: 98450,
    totalProfitShare: 28900,
    withdrawableAmount: 55120,
    withdrawanAmount: 40000,
    totalBookings: 87,
  },
  MONTH: {
    bookingsRevenue: 1234567,
    totalProfitShare: 345678,
    withdrawableAmount: 789123,
    withdrawanAmount: 500000,
    totalBookings: 456,
  },
  YEAR: {
    bookingsRevenue: 14820000,
    totalProfitShare: 4150000,
    withdrawableAmount: 9470000,
    withdrawanAmount: 6000000,
    totalBookings: 5480,
  },
}


// Default fallback (month)
export const overviewData: OverviewType = overviewDataByPeriod.MONTH
