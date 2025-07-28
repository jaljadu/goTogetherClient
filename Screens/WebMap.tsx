import React from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

type WebMapProps = {
  sourceCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  routeCoords?: { lat: number; lng: number }[];
};

const WebMap: React.FC<WebMapProps> = ({ sourceCoords, destinationCoords, routeCoords }) => {
  const defaultCenter = sourceCoords || { lat: 22.5726, lng: 88.3639 };

  return (
    <LoadScript googleMapsApiKey="AIzaSyB-ssWyB19Ujf-ZlbXjrhuoIz66tFl1OOw">
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12}>
        {sourceCoords && <Marker position={sourceCoords} label="S" />}
        {destinationCoords && <Marker position={destinationCoords} label="D" />}
        {routeCoords && routeCoords.length > 0 && (
          <Polyline
            path={routeCoords}
            options={{ strokeColor: '#2336f0', strokeWeight: 4 }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default WebMap;
