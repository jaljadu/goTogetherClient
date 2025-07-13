// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './Screens/RegisterScreen';
import BottomTabs from './Screens/Navigations/BottomTabs';
import { RootStackParamList } from './Screens/types';
import LocationSearchScreen from './Screens/LocationSearchScreen';
import { LocationProvider } from './Screens/LocationContext';
import CompleteProfileScreen from './Screens/CompleteProfileScreen';
import { UserProvider } from './Screens/UserContext';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
     <LocationProvider>
      <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen
  name="LocationSearch"
  component={LocationSearchScreen}
  options={{ headerShown: false }}
/>
   <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
    </LocationProvider>
  );
}
