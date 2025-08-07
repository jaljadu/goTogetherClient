import React, { useEffect } from 'react';
import { Button, TouchableOpacity, View,Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appStyles } from '../styles/appStyles';
import { AntDesign } from '@expo/vector-icons'; // for Google icon (or use MaterialCommunityIcons)
import {useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import axios from 'axios';
import { useUser } from './UserContext';
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CompleteProfile'>;

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
const navigation = useNavigation<NavigationProp>();
const { setUser } = useUser();
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'com.barnaviproduction.gotogether',
  path :'https://auth.expo.io/jaljadu/goTogetherClient' // ✅ This is valid here
});
  const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: '657032691252-6d3uvir16pu0k46lvbv5u481qi02aafl.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  webClientId: '657032691252-6d3uvir16pu0k46lvbv5u481qi02aafl.apps.googleusercontent.com',
  redirectUri:redirectUri,
   scopes: ['profile', 'email'],
});

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchGoogleUserInfo(authentication?.accessToken);
    }
  }, [response]);

  const fetchGoogleUserInfo = async (token: string | undefined) => {
    if (!token) return;
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    console.log('Google user', user);

    // 🔐 Send to your Node.js backend for auth
    // await axios.post('https://your-api.com/auth/google', { user });
  };
  useEffect(() => {
  GoogleSignin.configure({
    webClientId: '657032691252-6d3uvir16pu0k46lvbv5u481qi02aafl.apps.googleusercontent.com',

    offlineAccess: true,
  });
}, []);

  async function onGoogleButtonPress() {
    try {

    
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const signInResult = await GoogleSignin.signIn();
   
  // Try the new style of google-sign in result, from v13+ of that module
  let idToken = signInResult.data?.idToken;
 
  var url =api.Baseurl + 'users/get';
  console.log(idToken);

  
  
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const userData = response.data;

  if(userData) {
    setUser({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    photo: userData.photo,
    gender: userData.gender,
    userType: userData.userType,
    lastLogin:userData.lastLogin
  });
  await AsyncStorage.setItem('userToken',idToken as string);
    navigation.navigate('CompleteProfile', {
    userInfo:signInResult, // pass name, email etc.
});

  }

else {
    navigation.navigate('CompleteProfile', {
    userInfo:signInResult, // pass name, email etc.
});
  
}
  if (!idToken) {
    throw new Error('No ID token found');
  }
}
catch(ex) {
    console.log(ex)
}
  
}

  return (
    <View >
      <TouchableOpacity
        style={appStyles.googleButton}
        onPress={onGoogleButtonPress}
        activeOpacity={0.8}
      >
        <AntDesign name="google" size={20} color="#fff" style={appStyles.icon} />
        <Text style={appStyles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    
    </View>
   
  );
}

