import type { DynamicIconNameType } from "@/types"

export interface MetricType {
  period: string
  value: number
  percentageChange: number
}

export interface OverviewType {
  bookingsRevenue: number
  totalProfitShare: number
  withdrawableAmount: number
  withdrawanAmount: number
  totalBookings: number
}

export interface RevenueTrendItemType {
  label: string
  revenue: number
}

export interface BookingsTrendType {
  revenueTrends: RevenueTrendItemType[]
  summary: {
    totalPending: number
    totalConfirmed: number
    totalCancelled: number
    totalCompleted: number
  }
  totalRevenue: number
}

export interface SalesRepresentativeType {
  period: string
  representatives: Array<{
    name: string
    avatar: string
    email: string
    sales: number
  }>
}

export interface LeadSourceType {
  period: string
  summary: {
    totalLeads: number
  }
  leads: {
    socialMedia: number
    emailCampaigns: number
    referrals: number
    website: number
    other: number
  }
}

export interface CustomerSatisfactionType {
  period: string
  summary: {
    name: string
    value: number
  }
  feedbacks: Array<{
    name: string
    email: string
    avatar: string
    rating: number
    feedbackMessage: string
    createdAt: Date
  }>
}

export interface ActiveProjectType {
  name: string
  progress: number
  startDate: Date
  dueDate: Date
  status: "On Track" | "At Risk" | "On Hold"
}

export interface SalesByCountryType {
  period: string
  countries: Array<{
    countryName: string
    countryCode: string
    sales: number
  }>
}

export interface RevenueTrendType {
  period: string
  summary: {
    totalRevenue: number
    totalPercentageChange: number
  }
  revenueTrends: Array<{ month: string; revenue: number }>
}

export type ActivityType =
  | "email"
  | "supportTicket"
  | "dealUpdate"
  | "call"
  | "meeting"
  | "note"

export interface AssignedMemberType {
  name: string
  avatar: string
  href: string
}

export interface ActivityTimelineType {
  period: string
  activities: Array<{
    type: ActivityType
    iconName: DynamicIconNameType
    fill: string
    title: string
    description: string
    status?: string
    date: string
    assignedMembers: AssignedMemberType[]
  }>
}

export type BookingStatusType = "Confirmed" | "Completed" | "Cancelled" | "Pending"

export interface LatestBookingType {
  id: string
  customerName: string
  customerAvatar: string
  courtName: string
  date: Date
  duration: number        // minutes
  amount: number          // SAR / AED
  status: BookingStatusType
}

export interface TopSellingCourtType {
  _id: string
  name: string
  revenue: number
  bookings: number
}

export interface DashboardAnalyticsType extends OverviewType {
  bookingTrend: BookingsTrendType
  courts: TopSellingCourtType[]
  total: number
  page: number
  limit: number
  pages: number
}



