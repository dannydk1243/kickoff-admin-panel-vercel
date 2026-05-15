import type { LatestBookingType } from "../types"

import { LatestBookingsItem } from "./latest-bookings-item"

export function LatestBookingsList({ data }: { data: LatestBookingType[] }) {
  return (
    <ul className="flex flex-col gap-y-2">
      {data.map((booking) => (
        <LatestBookingsItem key={booking.id} booking={booking} />
      ))}
    </ul>
  )
}
