import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { api } from './api';
import * as Location from 'expo-location';
import countries from 'i18n-iso-countries';
import { getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import PhoneNumberInput from './PhoneNumberInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CompleteProfileScreen({ route, navigation }: any) {
  countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
  const { userInfo } = route.params;
  const [gender, setGender] = useState<'men' | 'women' | null>('men');
  const [imageUrl, setImage] = useState<string | null>('');
  const [name, setName] = useState<string | null>('');
  const [phoneNumber, setPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [userType, setuserType] = useState<'rider' | 'biker' | 'car_owner' | null>('biker');
  const getCountryCallingCode = async (): Promise<string> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return '+91'; // fallback
    }

    const location = await Location.getCurrentPositionAsync({});
    const geocode = await Location.reverseGeocodeAsync(location.coords);

    const countryCode = geocode[0]?.isoCountryCode; // e.g. 'IN', 'US'
    if (!countryCode) return '+91';

    const { getCountryCallingCode} = await import('libphonenumber-js');

    const callingCode = getCountryCallingCode(countryCode as CountryCode);
    return `+${callingCode}`;
  } catch (err) {
    console.error(err);
    return '+00'; // fallback
  }
};
useEffect(() => {
  (async () => {
     let ll=await getCountryCallingCode();
     console.log(ll);
     setPhoneCode(ll);
     if(route?.params?.userInfo?.data?.user?.photo){
        setName(route?.params?.userInfo?.data?.user?.name);
     }
     if(route?.params?.userInfo?.data?.user?.photo){
        setImage(route?.params?.userInfo?.data?.user?.photo);
     }
  //  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
   // if (status !== 'granted') {
     // alert('Permission to access media library is required!');
   // }
  })();
}, []);
  const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    setImage(result?.assets?.[0]?.uri || '' );
  };
 const setGenderMaleFemale= async (gender:any)=>{
    setGender(gender); 
    if(route?.params?.userInfo?.data?.user?.photo){
        setImage(route?.params?.userInfo?.data?.user?.photo);
     }
     else {
        setImage(api.PhotoUrl + gender + '\\50.jpg');
     }
    
 }
  const handleRegister = async () => {
    // Send user info to server
    console.log(route);

    const profile = {
      name: route.params.userInfo.data.user.name,
      email: route.params.userInfo.data.user.email,
      gender,
      imageUrl,
      phoneNumber,
      userType
    };
   
    try {
    await axios.post(`${api.Baseurl}users`, profile);
   // await axios.post(`${api.Baseurl}users`, profile);

    
    navigation.replace('MainTabs');
    }
    catch(ex){
      console.log(`${api.Baseurl}users`);
    }
    
  };

  return (
    <View style={styles.container}>
    <Text style={styles.header}>Register with GoTogether</Text>  
    <View>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.profileImage} />
        ) : (
          <Text>Upload Image</Text>
        )}
      </TouchableOpacity>
    <Text style={styles.header}>{name}</Text>
    </View>
  <View style={styles.toggleContainer}>
  <TouchableOpacity onPress={() => setuserType('rider')} style={[styles.toggle, userType === 'rider' && styles.selected]}>
    <FontAwesome5 name="user" size={16} color={userType === 'rider' ? '#fff' : 'green'} style={styles.icon} />
    <Text style={[styles.toggleText, userType === 'rider' && styles.selectedText]}>Rider</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setuserType('biker')} style={[styles.toggle, userType === 'biker' && styles.selected]}>
    <FontAwesome5 name="motorcycle" size={16} color={userType === 'biker' ? '#fff' : 'green'} style={styles.icon} />
    <Text style={[styles.toggleText, userType === 'biker' && styles.selectedText]}>Biker</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setuserType('car_owner')} style={[styles.toggle, userType === 'car_owner' && styles.selected]}>
    <FontAwesome5 name="car" size={16} color={userType === 'car_owner' ? '#fff' : 'green'} style={styles.icon} />
    <Text style={[styles.toggleText, userType === 'car_owner' && styles.selectedText]}>Car Owner</Text>
  </TouchableOpacity>
</View>
    
    <PhoneNumberInput phoneNumber={phoneNumber} setPhone={setPhone} countryCode={phoneCode} />
    <View style={styles.toggleContainer}>
  <TouchableOpacity
    onPress={() => setGenderMaleFemale('men')}
    style={[styles.toggle, gender === 'men' && styles.selected]}
  >
    <FontAwesome5 name="male" size={20} color={gender === 'men' ? '#fff' : '#333'} />
    <Text style={styles.toggleText}> Male</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setGenderMaleFemale('women')}
    style={[styles.toggle, gender === 'women' && styles.selected]}
  >
    <FontAwesome5 name="female" size={20} color={gender === 'women' ? '#fff' : '#333'} />
    <Text style={styles.toggleText}> Female</Text>
  </TouchableOpacity>
</View>
    
    <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, { backgroundColor: '#ccc' }]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
    </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent:'center',
    marginTop:50,
  },
  header:{
    fontSize:22,
    justifyContent:'center',
    textAlign:'center',
    marginBottom:10,
    color:'#10b927',
    shadowColor:'red',
    shadowOpacity:0.6,


  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop:15
  },
 toggle: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: '#eee',
  borderRadius: 8,
},
  selected: {
    backgroundColor: '#4caf50',
  },
  selectedText: {
  color: '#fff',
},
  toggleText: {
  marginLeft: 8,
  color: '#333',
  fontSize: 16,
},
icon: {
  marginRight: 6,
},
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
    height: 120,
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  dropdown: {
    marginBottom: 20,
    zIndex: 10,
  },
  buttonRow: {
    marginTop:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 14,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

