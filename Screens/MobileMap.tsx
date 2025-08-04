// components/MobileMap.tsx
import React, { RefObject } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import { appStyles } from '../styles/appStyles'; // adjust path
import { MatchRider } from './Ride';
import { LocationType } from './LocationContext';

type Location = {
  latitude: number;
  longitude: number;
}
type Props = {
  location: Location;
  routeCoords: LatLng[];
  source?: LocationType |null;
  destination?: LocationType |null;
  selectedRide?: MatchRider |null;
  mapRef?: RefObject<MapView>;
};

export const MobileMap: React.FC<Props> = ({ location, routeCoords, source, destination, selectedRide, mapRef }) => {
  return (
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
  );
};

export default MobileMap;
