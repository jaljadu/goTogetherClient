// components/WebMap.tsx
import React from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { MatchRider } from './Ride';
import { LocationType } from './LocationContext';
console.log('LOADED WEB MAP')
type LatLng = {
  latitude: number;
  longitude: number;
};

type Props = {
  location: LatLng;
  routeCoords: LatLng[];
  source?: LocationType | null;
  destination?: LocationType | null;
  selectedRide?: MatchRider | null;
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const WebMap: React.FC<Props> = ({ location, routeCoords, source, destination, selectedRide }) => {
  const defaultCenter = {
    lat: location.latitude,
    lng: location.longitude,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyB-ssWyB19Ujf-ZlbXjrhuoIz66tFl1OOw">
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12}>
        
        {/* Current Location Marker */}
        {routeCoords.length === 0 && (
          <Marker position={defaultCenter} title="You are here" />
        )}

        {/* Start Marker */}
        {source?.place_id && routeCoords.length > 0 && (
          <Marker
            position={{
              lat: routeCoords[0].latitude,
              lng: routeCoords[0].longitude,
            }}
            title="Start"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
          />
        )}

        {/* Destination Marker */}
        {destination?.place_id && routeCoords.length > 0 && (
          <Marker
            position={{
              lat: routeCoords[routeCoords.length - 1].latitude,
              lng: routeCoords[routeCoords.length - 1].longitude,
            }}
            title="Destination"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
          />
        )}

        {/* Main Route */}
        {routeCoords.length > 0 && (
          <Polyline
            path={routeCoords.map(coord => ({ lat: coord.latitude, lng: coord.longitude }))}
            options={{ strokeColor: '#2336f0', strokeWeight: 6 }}
          />
        )}

        {/* Rider Source to Your Source */}
        {selectedRide?.sourceLocation?.coordinates && routeCoords.length > 0 && (
          <Polyline
            path={[
              { lat: routeCoords[0].latitude, lng: routeCoords[0].longitude },
              {
                lat: selectedRide.sourceLocation.coordinates[0] as number,
                lng: selectedRide.sourceLocation.coordinates[1] as number,
              },
            ]}
            options={{
              strokeColor: 'orange',
              strokeOpacity: 1.0,
              strokeWeight: 3,
              icons: [{
                icon: {
                  path: 'M 0,-1 0,1',
                  strokeOpacity: 1,
                  scale: 4,
                },
                offset: '0',
                repeat: '10px',
              }],
            }}
          />
        )}

        {/* Rider Destination to Your Destination */}
        {selectedRide?.destinationLocation?.coordinates && routeCoords.length > 0 && (
          <Polyline
            path={[
              {
                lat: routeCoords[routeCoords.length - 1].latitude,
                lng: routeCoords[routeCoords.length - 1].longitude,
              },
              {
                lat: selectedRide.destinationLocation.coordinates[0] as number,
                lng: selectedRide.destinationLocation.coordinates[1] as number,
              },
            ]}
            options={{
              strokeColor: 'red',
              strokeOpacity: 1.0,
              strokeWeight: 3,
              icons: [{
                icon: {
                  path: 'M 0,-1 0,1',
                  strokeOpacity: 1,
                  scale: 4,
                },
                offset: '0',
                repeat: '10px',
              }],
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default WebMap;
