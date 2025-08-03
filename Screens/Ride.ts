import { User } from "@react-native-google-signin/google-signin";
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

export interface MatchRider extends Ride {
  _id :string,
   userInfo :UserInfo,

}
export interface UserInfo {
 _id :string,
 name:string,
email:string,
gender:string,
phoneNumber:string,

imageUrl:string,
userType:string,
createdAt:string,
updatedAt:string

}
