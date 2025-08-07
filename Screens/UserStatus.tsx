import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getTimeAgo = (lastLogin: Date): { status: string; isOnline: boolean } => {
  const now = new Date();
  const loginDate = new Date(lastLogin);
  const diffMs = now.getTime() - loginDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes <= 5) return { status: 'Online', isOnline: true };
  if (diffMinutes < 60) return { status: `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`, isOnline: false };
  if (diffHours < 24) return { status: `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`, isOnline: false };

  return { status: `${diffDays} day${diffDays > 1 ? 's' : ''} ago`, isOnline: false };
};

const UserStatus = ({ lastLogin }: { lastLogin: Date }) => {
  const { status, isOnline } = getTimeAgo(lastLogin);

  return (
    <View style={styles.statusContainer}>
      <View
        style={[
          styles.statusDot,
          { backgroundColor: isOnline ? 'green' : 'red' },
        ]}
      />
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#555',
  },
});

export default UserStatus;
