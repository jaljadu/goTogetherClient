// navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../HomeScreen'
import MyRideScreen from '../MyRideScreen';
import MessagesScreen from '../MessagesScreen';
import SettingsScreen from '../SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'My Ride') iconName = 'car';
          else if (route.name === 'Message') iconName = 'chatbubble-ellipses';
          else if (route.name === 'My Setting') iconName = 'settings';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Ride" component={MyRideScreen} />
      <Tab.Screen name="Message" component={MessagesScreen} />
      <Tab.Screen name="My Setting" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
