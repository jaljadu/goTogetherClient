// components/CustomDropdown.tsx
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet } from 'react-native';

type CustomDropdownProps = {
  items: { label: string; value: string | number }[];
  value: string | number | null;
  setValue: React.Dispatch<React.SetStateAction<string | number | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder?: string;
  zIndex?: number;
};

export default function CustomDropdown({
  items,
  value,
  setValue,
  open,
  setOpen,
  placeholder,
  zIndex = 1000,
}: CustomDropdownProps) {
  
  return (
    <View style={[styles.dropdownContainer, { zIndex }]}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={() => {}}
        placeholder={placeholder}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownBox}
        textStyle={{
        fontSize: 12,
        }}
       
        listMode="SCROLLVIEW"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    marginVertical: 0,
    width:'50%',
    marginRight:2,
    marginLeft:2
   
  },
  dropdown: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    borderColor: '#ccc',
    paddingVertical:0,
    
  },
  dropdownBox: {
    backgroundColor: '#fff',
    borderColor: '#ccc'
  },
});
