// contexts/LocationContext.tsx
import React, { createContext, useState, useContext } from 'react';

export type LocationType = {
  description: String;
  place_id: String;
};

export type LocationContextType = {
  source: LocationType | null;
  destination: LocationType | null;
  setSource: (s: LocationType) => void;
  setDestination: (d: LocationType) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [source, setSource] = useState<LocationType | null>(null);
  const [destination, setDestination] = useState<LocationType | null>(null);

  return (
    <LocationContext.Provider value={{ source, destination, setSource, setDestination }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocationContext must be used inside LocationProvider');
  return context;
};
