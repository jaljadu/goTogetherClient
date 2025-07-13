export interface Ride {
    driverId?: string,
    origin?: {
    address?: String,
    lat?: Number,
    lng?: Number
  },
  destination?: {
    address?: String,
    lat?: Number,
    lng?: Number
  },
  startDate?: Date,
  startTime?:  Date,
  seatsAvailable?: String | Number,
  pricePerSeat?: Number,
  isRecurring?: Boolean,
  recurringPattern: String,
  isActive?: Boolean
}