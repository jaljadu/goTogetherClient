// screens/HomeScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { LatLng, Marker ,Polyline,PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { appStyles } from '../styles/appStyles';
import { CardCarousel } from './CardCarousel';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import haversine from 'haversine-distance';
import { useUser,User } from './UserContext';
// if using static Polyline
import axios from 'axios';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import polyline, { decode } from '@mapbox/polyline';
import { MainTabParamList, RootStackParamList } from './types';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocationContext } from './LocationContext';
import CustomDropdown from './CustomDropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from './api';
import { MatchRider, Ride } from './Ride';
export default function HomeScreen() {
type HomeRouteProp = RouteProp<MainTabParamList, 'Home'>;
const route = useRoute<HomeRouteProp>();
const GOOGLE_MAPS_API_KEY = 'AIzaSyB-ssWyB19Ujf-ZlbXjrhuoIz66tFl1OOw';
const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
const [sourcePlaceId, setSourcePlaceId] = useState('');
const [destinationPlaceId, setDestinationPlaceId] = useState('');
const [showPicker, setShowPicker] = useState(false);
const [startTime, setStartTime] = useState(new Date());
const [rideCreated, setRideCreated] = useState(false);
const Stack = createNativeStackNavigator<RootStackParamList>();  
const { source, destination } = useLocationContext();
 const { user } = useUser();
//const [matchedRiders, setMatchedRiders] = useState([
  //{
   // name: 'Arjun',
   // time: '8:00 AM',
   // start: 'Salt Lake, Sector V',
   // end: 'Howrah Maidan',
   // price: 50,
   // photo: 'https://randomuser.me/api/portraits/men/75.jpg',
   // rating:5,
   // reviews:"s",
   // startCoords: { latitude: 22.5726, longitude: 88.3639 },  // example
   // endCoords: { latitude: 22.5200, longitude: 88.3700 },
  //},
  //{
   // name: 'Sita',
   // time: '8:15 AM',
    //start: 'Behala',
    //end: 'Ballygunge',
    //price: 60,
    //photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    //rating:5,
    //reviews:"s",
    //startCoords: { latitude: 22.5726, longitude: 88.3639 },  // example
     //endCoords: { latitude: 22.6200, longitude: 88.3700 },
  //}
//]);

const [matchedRiders, setMatchedRiders] = useState<MatchRider[]>([]);

const [selectedSeats, setSelectedSeats] = useState<string | number | null>(null);
const [openSeat, setOpenSeat] = useState<boolean>(false);
const [selectedDay, setSelectedDay] = useState<string | number | null>(null);
const [openDay, setOpenDay] = useState<boolean>(false);
const [selectedOwner, setSelectedOwner] = useState<string | number | null>(null);
const [openOwner, setOpenOwner] = useState<boolean>(false);
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocationSearch'>;
const navigation = useNavigation<NavigationProp>();
const mapRef = useRef<MapView>(null); // 👈 Map reference

const { setSource, setDestination } = useLocationContext();
const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
     
      setLocation(currentLocation.coords);
      setSelectedDay('today');
      setSelectedOwner(user?.userType as string); 
      if(user?.userType==='rider' || user?.userType==='biker') {
        setSelectedSeats(1);
      }
      else {
        setSelectedSeats(3);
      }
     
      var url=api.Baseurl + 'rides/getRideById?userid='+ user?.id;
    
      const ride= await axios.get(url);
     
      if(ride && ride.data) {
         const ridedata=ride.data[0] as Ride ;
       
         if(ridedata && ridedata.sourceLocation?.coordinates && 
            ridedata.sourceLocation?.coordinates.length>0  
           && ridedata.destinationLocation?.coordinates
        ) {
          const sourcedes=await reverseGeocode(ridedata?.sourceLocation?.coordinates[0],
            ridedata.sourceLocation.coordinates[1]);
          const Destdes=await reverseGeocode(ridedata?.destinationLocation?.coordinates[0],
            ridedata?.destinationLocation?.coordinates[1]);
        
         setSource({
          description:sourcedes,
          place_id:ridedata?.sourceLocation?.placeId ||''
         });
         setDestination({
          description:Destdes ||'',
          place_id:ridedata?.destinationLocation?.placeId ||''
         });
        }
        setRideCreated(true);
        await fetchAllRides();
      }
    })();
}, []);

useEffect(() => {
  if (source?.place_id && destination?.place_id) {
    fetchRoute(source.place_id, destination.place_id);
  }
}, [source, destination]);



const  handleCreateRide = async () => {
    setRideCreated(true);
   if(!user || !source || !destination) {
     return;
   }
    const ride :Ride =
    {
        userId :user.id,
        userType:user?.userType,
        sourceLocation: {
          placeId:source.place_id,
          description:source.description,
          type: "Point",
          coordinates:[ routeCoords[0].latitude,routeCoords[0].longitude]
        },
        destinationLocation: {
          type: "Point",
          placeId:destination.place_id,
           description: destination.description,
          coordinates:[routeCoords[routeCoords.length-1].latitude,routeCoords[routeCoords.length-1].longitude]
        },
        waypoints:[],
        date : selectedDay === 'today' ? new Date() : new Date(),
        seatsAvailable : selectedSeats || 1,
        price :50.0,
        isRecurring:true,
        recurringPattern:'mon,tue,wed,thu,fri',
        isActive:true
    }
    await axios.post(`${api.Baseurl}rides`, ride); 
    
};

const fetchRouteAndUpdateMap = (rider:MatchRider) => {
  
  setSelectedRide(rider);
  if(routeCoords.length>0) {
const sourceGap = haversine(routeCoords[0],[ rider.sourceLocation.coordinates[0] as number,
  rider.sourceLocation.coordinates[1] as number]) / 1000;
   const destGap = haversine(routeCoords[routeCoords.length-1], 
    [rider.destinationLocation.coordinates[0] as number,rider.destinationLocation.coordinates[1] as number  ]) / 1000;
  
  }
  
};


const getLatLngFromPlaceId = async (placeId: string): Promise<{ lat: number; lng: number }> => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const json = await res.json();
  const location = json.result?.geometry?.location;
  return { lat: location.lat, lng: location.lng };
};

const reverseGeocode = async (lat: Number, lng: Number): Promise<string> => {
  try {
    const url =`${api.Baseurl}locationsearch/reverseGeocode?lat=${lat}&lng=${lng}`
    const response = await fetch(url);
    const json = await response.json();

    if (json.status === 'OK' && json.results.length > 0) {
      return json.results[0].formatted_address;
    } else {
      console.warn('No address found');
      return '';
    }
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return '';
  }
};

const handleTimeChange = (_: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartTime(selectedDate);
    }
};

const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);

const fetchRoute = async (sourcePlaceId: String, destinationPlaceId: String) => {
  try {
     var url=`${api.Baseurl}locationsearch/getDirectionByPlace?sourcePlaceId=${sourcePlaceId}&destinationPlaceId=${destinationPlaceId}`;
    //var url=`${api.Baseurl}locationsearch/getDirectionByPlace?https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${sourcePlaceId}&destination=place_id:${destinationPlaceId}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    const points = polyline.decode(json.routes[0].overview_polyline.points);
    
    const coords = points.map(([lat, lng]) => ({
      latitude: lat,
      longitude: lng,
    }));
   
    setRouteCoords(coords);
  } catch (err) {
    console.error('Route fetch failed:', err);
  }
};

useEffect(() => {
  if (routeCoords.length > 0 && mapRef.current) {
    mapRef.current.fitToCoordinates(routeCoords, {
      edgePadding: {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100,
      },
      animated: true,
    });
  }
}, [routeCoords]);

const fetchAllRides= async ()=> {
  try {
    console.log('te');
    //if(rideCreated){
      const url=`${api.Baseurl}rides/getAllRides?id=${user?.id}`
      console.log(url);
      const response=await fetch(url);
      const json = await response.json() as MatchRider[];
      if(json.length>0) {
        json.forEach((element:MatchRider)  => {
        //  element.sourceLocation.placeId
        });
      }
      console.log(json);
      setMatchedRiders(json);
      if(json.length>0){
          setSelectedRide(json[0]);
          var tt=new Date(json[0].date).toLocaleTimeString();
          console.log(tt);
          await fetchRouteAndUpdateMap(json[0]);
      }
        
 // }
  }
  catch(err){
    console.log(err);
  }
}

return (
    <SafeAreaView style={appStyles.mainContainer}>

      {/* Map */}
      {location && (
        <View  style={appStyles.mapContanier}>
        <MapView  style={{ flex: 1 }} ref={mapRef}
          provider={PROVIDER_GOOGLE}
          showsTraffic={false}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >

      {routeCoords.length==0 &&     
        <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="You are here"
        />
      }
         
  {source?.place_id && routeCoords.length>0 && (
    <Marker
      coordinate={routeCoords[0]}
      title="Start"
      pinColor="green"
    />
  )}

 
  {destination?.place_id && routeCoords.length>0 &&  (
    <Marker
      coordinate={routeCoords[routeCoords.length-1]}
      title="Destination"
      pinColor="red"
    />
  )}

  {routeCoords.length > 0 && (
          
    <Polyline
      coordinates={routeCoords}
      strokeWidth={6}
      strokeColor="#2336f0"
    />
    
    
  )}
  {selectedRide && selectedRide.sourceLocation?.coordinates && routeCoords.length>0 && (
  <>
    {/* Line: Your Source to Rider's Source */}
    <Polyline
      coordinates={[routeCoords[0],
        {
          latitude: selectedRide.sourceLocation.coordinates[0] as number,
          longitude: selectedRide.sourceLocation.coordinates[1] as number
        }]}
      strokeColor="orange"
      strokeWidth={3}
      lineDashPattern={[5, 5]}
    />

    {/* Line: Your Destination to Rider's Destination */}
    {selectedRide &&  selectedRide.destinationLocation &&  routeCoords.length>0  && selectedRide.destinationLocation.coordinates && (
      <Polyline
        coordinates={[routeCoords[routeCoords.length-1], {
          latitude: selectedRide.destinationLocation.coordinates[0] as number,
          longitude: selectedRide.destinationLocation.coordinates[1] as number
        }]}
        strokeColor="red"
        strokeWidth={3}
        lineDashPattern={[5, 5]}
      />
    )}
  </>
)}
        </MapView>
        <TouchableOpacity style={appStyles.floatingPlusButton} onPress={() => setRideCreated(false)}>
  <FontAwesome name="plus" size={20} color="#fff" />
</TouchableOpacity>
        </View>
      )}

      {/* Filter Card */}
      <View style={appStyles.bottomContainer}>
        {!rideCreated ? (
          <>
           <View style={appStyles.createRiderContainter}>
          <View style={appStyles.inputRowFull}>
      <FontAwesome name="location-arrow" size={20} color="green" style={appStyles.iconLeft} />
      <TouchableOpacity
        style={appStyles.inputTouchable}
        onPress={() => navigation.navigate('LocationSearch', { type: 'source' })}
      >
        <Text numberOfLines={1} ellipsizeMode="tail" style={appStyles.inputText}>
          {source?.description || 'Enter Source'}
        </Text>
      </TouchableOpacity>
      <FontAwesome6 name="location-crosshairs" size={20} color="green" style={appStyles.iconRight} />
    </View>

    {/* 🔹 2nd Row: Destination */}
    <View style={appStyles.inputRowFull}>
      <FontAwesome6 name="location-pin" size={20} color="red" style={appStyles.iconLeft} />
      <TouchableOpacity
        style={appStyles.inputTouchable}
        onPress={() => navigation.navigate('LocationSearch', { type: 'destination' })}
      >
        <Text numberOfLines={1} ellipsizeMode="tail" style={appStyles.inputText}>
          {destination?.description || 'Enter Destination'}
        </Text>
      </TouchableOpacity>
    </View>

    {/* 🔹 3rd Row: Today/Tomorrow & Time Picker */}
  <View style={appStyles.inputRowSplit}>
    <CustomDropdown
    items={[
      { label: 'Today', value: 'today' },
      { label: 'Tomorrow', value: 'tomorrow' },
    ]}
    placeholder="Select Date"
    setValue={setSelectedDay}
    value={selectedDay}
    open={openDay}
    setOpen={setOpenDay}
    zIndex={1000}
  />
  <TouchableOpacity onPress={() => setShowPicker(true)} style={appStyles.timePicker}>
     <Ionicons name="time-outline" color="green"  size={20}/>
        <Text style={{ marginLeft: 6,color:'green' }}>
          {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
    </TouchableOpacity>
    </View>
    {showPicker && (
      <DateTimePicker
        mode="time"
        display="default"
        value={startTime}
        onChange={handleTimeChange}
      />
    )}

    {/* 🔹 4th Row: Role Dropdown & Seat Slider */}
  <View style={appStyles.inputRowSplit}>
  <CustomDropdown
  items={[
    { label: 'I am rider', value: 'rider' },
    { label: 'I am biker', value: 'biker' },
    { label: 'Car owner', value: 'car_owner' },
  ]}
  placeholder="Who you are?"
  setValue={setSelectedOwner}
  value={selectedOwner}
  open={openOwner}
  setOpen={setOpenOwner}
  zIndex={1000}
/>

<View style={appStyles.pickerWrap}>
  <Text style={appStyles.dropdownText}>Seat required</Text>
  <CustomDropdown
  items={[
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
  ]}
  placeholder="Select Seats"
  setValue={setSelectedSeats}
  value={selectedSeats}
  open={openSeat}
  setOpen={setOpenSeat}
  zIndex={1000}
/>
  </View>
    </View>

    {/* 🔹 5th Row: Create Ride Button */}
    <TouchableOpacity style={appStyles.createBtn} onPress={handleCreateRide}>
      <Text style={appStyles.btnText}>+ Create Ride</Text>
    </TouchableOpacity>
           </View>
            
          </>
        ) : (
          <>
    
      <CardCarousel
        data={matchedRiders}
        onCardChange={(rider) => {
        fetchRouteAndUpdateMap(rider);
      }}
  />
          </>
        )}
      </View>
      
    </SafeAreaView>
);

}