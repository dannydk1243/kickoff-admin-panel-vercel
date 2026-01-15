export type InvoiceType = {
  _id: string
  name: string
  description: string
  sport: string
  surface: string
  size: string
  capacity: number
  price: number
  currency: string
  avatar: string
  status: string
  isActive: boolean
  slotDurationMinutes: number
  bufferMinutes: number
  offersTraining: boolean
  createdAt: string
  updatedAt: string

  location: {
    _id: string
    city: string
    area: string
    district: string
    address: string
    locationId: string
    latitude: number
    longitude: number
  }

  owner: {
    _id: string
    name: string
    email: string
    role: string
  }

  amenities: string[]
}


// export interface InvoiceType {
//   _id: string
//   status: string
//   method: string
//   amount: `$${string}`
//   phone: string
// }

