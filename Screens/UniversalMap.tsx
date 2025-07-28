// New File: components/UniversalMap.tsx
import React from 'react';
import { View } from 'react-native';
import MobileMap from './MobileMap';
import WebMap from './WebMap';
import { Platform } from 'react-native';

const UniversalMap = ({
  location :any,
  mapRef,
  routeCoords,
  source,
  destination,
  selectedRide
}: any) => {
  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
        <WebMap
          location={location}
          routeCoords={routeCoords}
          source={source}
          destination={destination}
          selectedRide={selectedRide}
        />
      ) : (
        <MobileMap
          location={location}
          mapRef={mapRef}
          routeCoords={routeCoords}
          source={source}
          destination={destination}
          selectedRide={selectedRide}
        />
      )}
    </View>
  );
};

export default UniversalMap;
