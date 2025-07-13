import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
export default function PhoneNumberInput({
  phoneNumber,
  setPhone,
  countryCode = '+00', // default fallback
}: {
  phoneNumber: string;
  setPhone: (val: string) => void;
  countryCode?: string;
}) {
  return (
    <View style={styles.phoneInputContainer}>
      <Text style={styles.countryCode}>{countryCode}</Text>
      <TextInput
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.textInput}
      />
      <FontAwesome name="phone" size={20} color="#555" style={styles.phoneIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  phoneInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  paddingHorizontal: 10,
  marginVertical: 10,
  position: 'relative',
},

countryCode: {
  marginRight: 6,
  fontSize: 16,
  color: '#333',
},

textInput: {
  flex: 1,
  fontSize: 16,
  paddingVertical: 10,
  paddingRight: 30, // leave space for icon
},

phoneIcon: {
  position: 'absolute',
  right: 12,
}

});
