import type { TopSellingCourtType } from "../types"

import { TopSellingCourtsItem } from "./top-selling-courts-item"

export function TopSellingCourtsList({ data }: { data: TopSellingCourtType[] }) {
  return (
    <ul className="space-y-2">
      {data.map((court, index) => (
        <TopSellingCourtsItem key={court._id || index} court={court} rank={index + 1} />
      ))}
    </ul>
  )
}
