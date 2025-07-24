import { geoPoint } from "../geoPoint";

export interface Ride {
  sourceLocation: geoPoint,
  destinationLocation: geoPoint,
  waypoints:geoPoint[] 
  isRecurring: Boolean ,
  recurringPattern:String ,
  userId: String  ,
  userType: string | undefined,
  seatsAvailable: number | String,
  price:  Number ,
  date: Date ,
  isActive:  Boolean,
}