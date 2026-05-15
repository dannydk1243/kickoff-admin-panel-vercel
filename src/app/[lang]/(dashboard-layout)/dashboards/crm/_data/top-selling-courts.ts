import type { TopSellingCourtType } from "../types"

export const topSellingCourtsDataByPeriod: Record<"WEEK" | "MONTH" | "YEAR", TopSellingCourtType[]> = {
  WEEK: [
    {
      _id: "1",
      name: "Arena Court A",
      bookings: 45,
      revenue: 5400,
    },
    {
      _id: "2",
      name: "Sunset Field",
      bookings: 38,
      revenue: 4560,
    },
    {
      _id: "3",
      name: "Pro Arena",
      bookings: 32,
      revenue: 3840,
    },
  ],
  MONTH: [
    {
      _id: "1",
      name: "Arena Court A",
      bookings: 312,
      revenue: 37440,
    },
    {
      _id: "2",
      name: "Sunset Field",
      bookings: 278,
      revenue: 32760,
    },
    {
      _id: "3",
      name: "Pro Arena",
      bookings: 245,
      revenue: 28900,
    },
    {
      _id: "4",
      name: "Indoor Pitch 1",
      bookings: 210,
      revenue: 24300,
    },
    {
      _id: "5",
      name: "Arena Court B",
      bookings: 188,
      revenue: 20680,
    },
  ],
  YEAR: [
    {
      _id: "1",
      name: "Arena Court A",
      bookings: 3850,
      revenue: 462000,
    },
    {
      _id: "2",
      name: "Sunset Field",
      bookings: 3420,
      revenue: 410400,
    },
    {
      _id: "3",
      name: "Pro Arena",
      bookings: 3100,
      revenue: 372000,
    },
    {
      _id: "4",
      name: "Indoor Pitch 1",
      bookings: 2800,
      revenue: 336000,
    },
    {
      _id: "5",
      name: "Arena Court B",
      bookings: 2400,
      revenue: 288000,
    },
  ],
}


export const topSellingCourtsData = topSellingCourtsDataByPeriod.MONTH
