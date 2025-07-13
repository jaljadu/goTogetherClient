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
import { Ride } from './Ride';
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
const [matchedRiders, setMatchedRiders] = useState([
  {
    name: 'Arjun',
    time: '8:00 AM',
    start: 'Salt Lake, Sector V',
    end: 'Howrah Maidan',
    price: 50,
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    rating:5,
    reviews:"s",
    startCoords: { latitude: 22.5726, longitude: 88.3639 },  // example
    endCoords: { latitude: 22.5200, longitude: 88.3700 },
  },
  {
    name: 'Sita',
    time: '8:15 AM',
    start: 'Behala',
    end: 'Ballygunge',
    price: 60,
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating:5,
    reviews:"s",
    startCoords: { latitude: 22.5726, longitude: 88.3639 },  // example
     endCoords: { latitude: 22.6200, longitude: 88.3700 },
  }
]);
type Rider = {
  name: string;
  start: string;
  end: string;
  time: string;
  price: number;
  photo?: string;
  rating?:number;
  reviews?:string;
  startCoords: any,  // example
  endCoords: any,

};
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
const [selectedRide, setSelectedRide] = useState<Rider | null>(null);
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
      const ride= await axios.get(api.Baseurl + 'rides');
      
      const ridedata=ride.data[0] as Ride ;
      console.log(ridedata);
      if(ridedata && ridedata.origin?.lat && ridedata.origin.lng 
        && ridedata.destination?.lat && ridedata.destination.lng
      ) {
        const sourcedes=await reverseGeocode(ridedata.origin.lat,ridedata.origin.lng);
        const Destdes=await reverseGeocode(ridedata.destination.lat,ridedata.destination.lng);
       
         setSource({
          description:sourcedes,
          place_id:ridedata?.origin?.address ||''
         });
         setDestination({
          description:Destdes ||'',
          place_id:ridedata?.destination?.address ||''
         });
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
   
    const ride :Ride =
    {
        driverId :user?.id,
        origin: {
          address:source?.place_id,
          lat: routeCoords[0].latitude,
          lng :routeCoords[0].longitude,
        },
        destination: {
          address:destination?.place_id,
          lat: routeCoords[routeCoords.length-1].latitude,
          lng :routeCoords[routeCoords.length-1].longitude,
        },
        startDate : selectedDay === 'today' ? new Date() : new Date(),
        startTime : startTime,
        seatsAvailable : selectedSeats || 1,
        pricePerSeat :50.0,
        isRecurring:true,
        recurringPattern:'mon,tue,wed,thu,fri',
        isActive:true
    }
    await axios.post(`${api.Baseurl}rides`, ride); 
    
};

const fetchRouteAndUpdateMap = (rider:any) => {
  
  setSelectedRide(rider);
  if(routeCoords.length>0) {
const sourceGap = haversine(routeCoords[0], rider.startCoords) / 1000;
   const destGap = haversine(routeCoords[routeCoords.length-1], rider.endCoords) / 1000;
   console.log(`Source gap: ${sourceGap.toFixed(2)} km`);
console.log(`Destination gap: ${destGap.toFixed(2)} km`);
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
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
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
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${sourcePlaceId}&destination=place_id:${destinationPlaceId}&key=${GOOGLE_MAPS_API_KEY}`
    );
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
  {selectedRide && selectedRide.startCoords && routeCoords.length>0 && (
  <>
    {/* Line: Your Source to Rider's Source */}
    <Polyline
      coordinates={[routeCoords[0], selectedRide.startCoords]}
      strokeColor="orange"
      strokeWidth={3}
      lineDashPattern={[5, 5]}
    />

    {/* Line: Your Destination to Rider's Destination */}
    {selectedRide &&  selectedRide.endCoords &&  routeCoords.length>0  && selectedRide.endCoords && (
      <Polyline
        coordinates={[routeCoords[routeCoords.length-1], selectedRide.endCoords]}
        strokeColor="red"
        strokeWidth={3}
        lineDashPattern={[5, 5]}
      />
    )}
  </>
)}
        </MapView>
        <TouchableOpacity style={appStyles.floatingPlusButton} onPress={() => console.log('Plus pressed')}>
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