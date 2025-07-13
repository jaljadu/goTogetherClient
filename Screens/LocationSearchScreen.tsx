import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types'; // make sure the path is correct
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocationContext } from './LocationContext';

type LocationSearchRouteProp = RouteProp<RootStackParamList, 'LocationSearch'>;
type LocationSearchNavProp = NativeStackNavigationProp<RootStackParamList>;

const GOOGLE_API_KEY = 'AIzaSyB-ssWyB19Ujf-ZlbXjrhuoIz66tFl1OOw'; // Replace with your actual key

export default function LocationSearchScreen() {
  const route = useRoute<LocationSearchRouteProp>();
  const navigation = useNavigation<LocationSearchNavProp>();
  const { setSource, setDestination } = useLocationContext();
  const { type } = route.params;

  const [input, setInput] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (text: string) => {
    setInput(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}&language=en`
      );
      const json = await res.json();
      if (json.predictions) {
        setResults(json.predictions);
      }
    } catch (err) {
      console.error('Places API error:', err);
    }
  };

  const handleSelect = (item: any) => {
    const place = {
    description: item.description,
    place_id: item.place_id,
  };

  if (type === 'source') {
    setSource(place);
  } else {
    setDestination(place);
  }

  navigation.goBack(); // or go to Home
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoFocus
        placeholder={`Search ${type === 'source' ? 'Source' : 'Destination'}`}
        value={input}
        onChangeText={handleSearch}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelect(item)}
          >
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: '#fff' },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
