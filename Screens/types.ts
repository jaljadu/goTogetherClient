// navigationTypes.ts

import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: {
    selectedPlace?: {
      type: 'source' | 'destination';
      description: string;
      place_id: string;
    };
  };
  MyRide: undefined;
  Message: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Register: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>; // ✅ accepts nested tabs
  LocationSearch: { type: 'source' | 'destination' };
  CompleteProfile: { userInfo: any };
};
