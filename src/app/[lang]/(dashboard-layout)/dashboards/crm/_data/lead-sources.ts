import type { LeadSourceType } from "../types"

export const leadSourcesDataByPeriod: Record<"WEEK" | "MONTH" | "YEAR", LeadSourceType> = {
  WEEK: {
    period: "Last week",
    summary: {
      totalLeads: 320,
    },
    leads: {
      socialMedia: 95,
      emailCampaigns: 72,
      referrals: 60,
      website: 58,
      other: 35,
    },
  },
  MONTH: {
    period: "Last month",
    summary: {
      totalLeads: 2200,
    },
    leads: {
      socialMedia: 600,
      emailCampaigns: 500,
      referrals: 450,
      website: 425,
      other: 325,
    },
  },
  YEAR: {
    period: "Last year",
    summary: {
      totalLeads: 26400,
    },
    leads: {
      socialMedia: 7200,
      emailCampaigns: 6000,
      referrals: 5400,
      website: 5100,
      other: 2700,
    },
  },
}

// Default fallback (month)
export const leadSourcesData: LeadSourceType = leadSourcesDataByPeriod.MONTH
