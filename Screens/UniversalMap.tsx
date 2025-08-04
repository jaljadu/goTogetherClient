// components/UniversalMap.tsx
import React from 'react';
import { View, Platform } from 'react-native';

const UniversalMap = ({
  location,
  mapRef,
  routeCoords,
  source,
  destination,
  selectedRide,
}: any) => {
  const mapProps = {
    location,
    routeCoords,
    source,
    destination,
    selectedRide,
    ...(Platform.OS !== 'web' && { mapRef }), // only pass `mapRef` on native
  };
  const MapComponent =
    Platform.OS === 'web'
      ? require('./WebMap').default
      : require('./WebMap').default;

  return (
    <View style={{ flex: 1 }}>
        <MapComponent {...mapProps} />
    </View>
  );
};

export default UniversalMap;
