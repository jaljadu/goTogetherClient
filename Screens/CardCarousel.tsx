import React, { useRef, useState, useEffect } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { appStyles } from '../styles/appStyles';
const CARD_HEIGHT = 210;



type Rider = {
  name: string;
  start: string;
  end: string;
  time: string;
  price: number;
  photo?: string;
  rating?:number;
  reviews?:string;
  startCoords: any,  // example
  endCoords: any,

};

type Props = {
  data: Rider[];
  onCardChange: (rider: Rider) => void;
};

export const CardCarousel: React.FC<Props> = ({ data, onCardChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef<FlatList<Rider>>(null);

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < data.length) {
      setSelectedIndex(index);
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  useEffect(() => {
    if (data[selectedIndex]) {
      onCardChange(data[selectedIndex]);
    }
  }, [selectedIndex]);

  return (
    <View style={appStyles.wrapper}>
     
      <View style={{ height: CARD_HEIGHT +10 }}>
<FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(_, index) => ({
          length:CARD_HEIGHT,
          offset: CARD_HEIGHT * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        style={appStyles.list}
          
    
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / CARD_HEIGHT);
          setSelectedIndex(index);
        }}
        renderItem={({ item, index }) => (
         <View style={[appStyles.matchCard]}>
            <View style={appStyles.cardHeader}>
                <Image source={{ uri: item.photo }} style={appStyles.avatarLarge} />
                <View style={appStyles.cardHeaderText}>
                <Text style={appStyles.name}>{item.name}</Text>
                <Text style={appStyles.rating}>⭐ {item.rating} ({item.reviews})</Text>
                </View>
                <Text style={appStyles.timeAgo}>an hour ago</Text>
            </View>

        <View style={appStyles.routeRow}>
            <View style={appStyles.dotLineContainer}>
            <View style={appStyles.dot} />
            <View style={appStyles.verticalLine} />
            <View style={[appStyles.dot, { backgroundColor: '#2196F3' }]} />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={appStyles.locationLabel}>Start</Text>
            <Text numberOfLines={1} style={appStyles.addressText}>{item.start}</Text>
            <Text style={[appStyles.locationLabel, { marginTop: 2 }]}>End</Text>
            <Text numberOfLines={1} style={appStyles.addressText}>{item.end}</Text>
        </View>
  </View>

  <View style={appStyles.metaRow}>
    <Text style={appStyles.timeText}>{item.time} <Text style={appStyles.subduedText}>Tomorrow</Text></Text>
    <Text style={appStyles.subduedText}>1 Seat Required</Text>
  </View>

  <TouchableOpacity style={appStyles.offerRideButton}>
  <View style={appStyles.offerRowContent}>
    <Text style={appStyles.offerPriceInside}>₹ {item.price}</Text>

    <View style={appStyles.offerTextWrapper}>
      <Text style={appStyles.offerRideText}>Offer ride</Text>
      <FontAwesome name="handshake-o" size={16} color="#fff" style={appStyles.offerIcon} />
    </View>
  </View>
</TouchableOpacity>
         </View>
        )}
      />
      </View>
      
      
     
    </View>
  );
};


