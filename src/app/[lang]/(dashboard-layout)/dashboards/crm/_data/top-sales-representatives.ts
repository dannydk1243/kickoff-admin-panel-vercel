import type { SalesRepresentativeType } from "../types"

export const salesRepresentativeDataByPeriod: Record<"WEEK" | "MONTH" | "YEAR", SalesRepresentativeType> = {
  WEEK: {
    period: "Last week",
    representatives: [
      {
        name: "Emily Smith",
        avatar: "/images/avatars/female-01.svg",
        sales: 12400,
        email: "emily.smith@example.com",
      },
      {
        name: "John Doe",
        avatar: "/images/avatars/male-01.svg",
        sales: 11800,
        email: "john.doe@example.com",
      },
      {
        name: "Michael Brown",
        avatar: "/images/avatars/male-02.svg",
        sales: 9500,
        email: "michael.brown@example.com",
      },
      {
        name: "Sarah Johnson",
        avatar: "/images/avatars/female-02.svg",
        sales: 8200,
        email: "sarah.johnson@example.com",
      },
      {
        name: "Olivia Martinez",
        avatar: "/images/avatars/female-03.svg",
        sales: 7100,
        email: "olivia.martinez@example.com",
      },
    ],
  },
  MONTH: {
    period: "Last month",
    representatives: [
      {
        name: "John Doe",
        avatar: "/images/avatars/male-01.svg",
        sales: 51099,
        email: "john.doe@example.com",
      },
      {
        name: "Emily Smith",
        avatar: "/images/avatars/female-01.svg",
        sales: 45078,
        email: "emily.smith@example.com",
      },
      {
        name: "Michael Brown",
        avatar: "/images/avatars/male-02.svg",
        sales: 40008,
        email: "michael.brown@example.com",
      },
      {
        name: "Olivia Martinez",
        avatar: "/images/avatars/female-03.svg",
        sales: 39000,
        email: "olivia.martinez@example.com",
      },
      {
        name: "Sarah Johnson",
        avatar: "/images/avatars/female-02.svg",
        sales: 22055,
        email: "sarah.johnson@example.com",
      },
    ],
  },
  YEAR: {
    period: "Last year",
    representatives: [
      {
        name: "Michael Brown",
        avatar: "/images/avatars/male-02.svg",
        sales: 612000,
        email: "michael.brown@example.com",
      },
      {
        name: "John Doe",
        avatar: "/images/avatars/male-01.svg",
        sales: 587000,
        email: "john.doe@example.com",
      },
      {
        name: "Emily Smith",
        avatar: "/images/avatars/female-01.svg",
        sales: 543000,
        email: "emily.smith@example.com",
      },
      {
        name: "Olivia Martinez",
        avatar: "/images/avatars/female-03.svg",
        sales: 468000,
        email: "olivia.martinez@example.com",
      },
      {
        name: "Sarah Johnson",
        avatar: "/images/avatars/female-02.svg",
        sales: 264000,
        email: "sarah.johnson@example.com",
      },
    ],
  },
}

// Default fallback (month)
export const salesRepresentativeData: SalesRepresentativeType = salesRepresentativeDataByPeriod.MONTH
