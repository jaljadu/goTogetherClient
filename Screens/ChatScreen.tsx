import React, { useEffect, useRef, useState,MutableRefObject } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { v4 as uuidv4 } from 'uuid';
import { appStyles } from '../styles/appStyles';
import axios from 'axios';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';


export default function ChatScreen({ route }:any) {
  const { conversationId, userInfo } = route.params;
  const [messages, setMessages] = useState<any>([]);
  const [text, setText] = useState('');
  const chatClientRef = useRef<ChatClient | null>(null);
  const chatThreadClientRef = useRef<ChatThreadClient | null>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        // 1. Get ACS token from backend
        const res = await axios.post('http://<your-server-url>/getAcsToken', {
          userId: userInfo.id,
        });

        const { token } = res.data;

        // 2. Initialize ChatClient
        const chatClient = new ChatClient(
          '<your-acs-endpoint>',
          new AzureCommunicationTokenCredential(token)
        );
        chatClientRef.current = chatClient;

        // 3. Get ChatThreadClient
        const chatThreadClient = await chatClient.getChatThreadClient(conversationId);
        chatThreadClientRef.current = chatThreadClient;

        // 4. Load existing messages
        const messagesResponse = chatThreadClient.listMessages();
        const loadedMessages = [];
        for await (let message of messagesResponse) {
          if (message.content?.message) {
            loadedMessages.push({
              id: message.id,
              content: message.content.message,
              sender: message.senderDisplayName,
              createdOn: message.createdOn,
            });
          }
        }
        setMessages(loadedMessages.reverse());

        // 5. Subscribe to new messages
        chatClient.startRealtimeNotifications();
        chatClient.on('chatMessageReceived', (e:any) => {
          if (e.threadId === conversationId) {
            setMessages((prev :any) => [
              ...prev,
              {
                id: e?.id,
                content: e?.message,
                sender: e?.senderDisplayName,
                createdOn: e?.createdOn,
              },
            ]);
          }
        });
      } catch (err) {
        console.error('Chat Init Error:', err);
      }
    };

    initChat();
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const messageId = uuidv4();
      await chatThreadClientRef.current?.sendMessage({
        content: text,
        
        
      });
      setText('');
    } catch (err) {
      console.error('Send Error:', err);
    }
  };

  const renderItem = ({ item }:any) => (
    <View style={appStyles.messageBubble}>
      <Text style={appStyles.senderName}>{item.sender}</Text>
      <Text style={appStyles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={appStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
        inverted
      />

      <View style={appStyles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={appStyles.chatInput}
        />
        <TouchableOpacity onPress={sendMessage} style={appStyles.sendButton}>
          <Text style={appStyles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
