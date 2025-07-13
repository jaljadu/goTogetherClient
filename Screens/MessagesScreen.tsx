import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appStyles } from '../styles/appStyles';
import axios from 'axios';
import { api } from './api';

export default function MessageScreen() {
  const [conversations, setConversations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get(api.Baseurl + 'notification/getConversions')
      .then(res => setConversations(res.data))
      .catch(err => console.error(err));
  }, []);

  const renderItem = ({ item}:any) => (
    <TouchableOpacity
      style={appStyles.messageCard}
      //onPress={() => navigation.navigate('ChatScreen', { conversationId: item.conversationId })}
    >
      <Image source={{ uri: item.photoUrl }} style={appStyles.userImage} />
      <View style={appStyles.messageContent}>
        <Text style={appStyles.userName}>{item.name}</Text>
        <Text style={appStyles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={appStyles.container}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => (item as any).conversationId}
      />
    </View>
  );
}
