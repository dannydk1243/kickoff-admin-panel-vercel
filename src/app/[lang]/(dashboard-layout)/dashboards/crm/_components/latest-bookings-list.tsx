import type { LatestBookingType } from "../types"

import { LatestBookingsItem } from "./latest-bookings-item"

export function LatestBookingsList({ data, dictionary }: { data: LatestBookingType[], dictionary?: any }) {
  return (
    <ul className="flex flex-col gap-y-2">
      {data.map((booking) => (
        <LatestBookingsItem key={booking.id} booking={booking} dictionary={dictionary} />
      ))}
    </ul>
  )
}
