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
import { MatchRider } from './Ride';
import DateLabel from './DateLabel';
import UserStatus from './UserStatus';
const CARD_HEIGHT = 210;

type Props = {
  data: MatchRider[];
  onCardChange: (rider: any) => void;
};

export const CardCarousel: React.FC<Props> = ({ data , onCardChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef<FlatList<MatchRider>>(null);

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
 
  const getTimeAgo = (lastLogin: Date): string => {
  const now = new Date();
  const loginDate = new Date(lastLogin);
  const diffMs = now.getTime() - loginDate.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes <= 5) return 'Online';
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

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
                <Image source={{ uri: item?.userInfo?.imageUrl }} style={appStyles.avatarLarge} />
                <View style={appStyles.cardHeaderText}>
                <Text style={appStyles.name}>{item?.userInfo?.name}</Text>
                <Text style={appStyles.rating}>⭐⭐⭐⭐⭐ </Text>
                </View>
                
               <UserStatus lastLogin={item?.userInfo.lastLogin} />
            </View>

        <View style={appStyles.routeRow}>
            <View style={appStyles.dotLineContainer}>
            <View style={appStyles.dot} />
            <View style={appStyles.verticalLine} />
            <View style={[appStyles.dot, { backgroundColor: '#2196F3' }]} />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={appStyles.locationLabel}>Start</Text>
            <Text numberOfLines={1} style={appStyles.addressText}>{item?.sourceLocation.description}</Text>
            <Text style={[appStyles.locationLabel, { marginTop: 2 }]}>End</Text>
            <Text numberOfLines={1} style={appStyles.addressText}>{item?.destinationLocation.description}</Text>
        </View>
  </View>

  <View style={appStyles.metaRow}>
    <Text style={appStyles.timeText}>{new Date(item?.date).toLocaleTimeString([],{
       hour: '2-digit',
       minute: '2-digit',
       hour12: true, 
    })} 
     <DateLabel dateString={item?.date}></DateLabel>
    </Text>
    <Text style={appStyles.subduedText}>{item?.seatsAvailable} Seat Required</Text>
  </View>

  <TouchableOpacity style={appStyles.offerRideButton}>
  <View style={appStyles.offerRowContent}>
    <Text style={appStyles.offerPriceInside}>₹ {item?.price?.toString()}</Text>

    <View style={appStyles.offerTextWrapper}>
      <Text style={appStyles.offerRideText}>{item?.userInfo?.userType==='Rider' ? 
        'Request':'Offer'} ride</Text>
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


