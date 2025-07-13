// screens/RegisterScreen.tsx
import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet,Image,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { appStyles } from '../styles/appStyles';
import MapView from 'react-native-maps';
import GoogleSignIn from './GoogleSignIn';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { api } from './api';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { useUser } from './UserContext';

export default function RegisterScreen( ) {
  const { setUser } = useUser();
  const [isRider, setIsRider] = useState(false);
  const [phone, setPhone] = useState('');
  const [homeLocation, setHomeLocation] = useState(null);
  const [officeLocation, setOfficeLocation] = useState(null);
  const [carType, setCarType] = useState<'two' | 'four'>('four');
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const handleSubmit = () => {
  const payload: any = { phone };

    if (isRider) {
      payload.homeLocation = homeLocation;
      payload.officeLocation = officeLocation;
      payload.carType = carType;
    }
    navigation.reset({
    index: 0,
    routes: [{ name: 'MainTabs' }],
    });
    console.log(payload);
    // call your backend API to register user
  };
 useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        
        const userInfo = await GoogleSignin.signInSilently();

         //if (isSignedIn) {
         // const userInfo = await GoogleSignin.signInSilently();
          const idToken = userInfo.data?.idToken;

        // Optional: store token
        //  const idToken =await AsyncStorage.getItem('userToken');
         
        console.log(idToken);

          if(idToken){
          // Get user from your backend
          const response = await axios.get(api.Baseurl +'users/get', {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          const userData = response.data;
          console.log(userData);
        
        if(userData) {
          setUser({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            photo: userData.photo,
            gender: userData.gender,
            userType: userData.userType,
         });
            navigation.navigate("MainTabs" as any);
        }
        }
        //} //else {
          //setLoading(false); // Not signed in, show Register screen
        //}
      } catch (err) {
        console.log('Auth check failed:', err);
        setLoading(false);
      }
    };

    checkIfLoggedIn();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/gotogetherlogo-removebg-preview.png')} // update path if different
        style={styles.logo}
        resizeMode="contain"
      />
      <GoogleSignIn />
    </View>
  );
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20
  }
});


