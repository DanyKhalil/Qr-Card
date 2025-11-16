import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets(); // this will help me avoid merging with ui default componentson phones

  return (
    <Tabs
      screenOptions={{
        // hte styling of the bottom bar
        tabBarHideOnKeyboard: true,
        animation: 'shift',
        tabBarActiveTintColor: '#FF571A',
        tabBarActiveBackgroundColor:'#eee',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#FF8559',
          height: 60 + insets.bottom,
          // paddingBottom: 8 + insets.bottom,
        },
        
        // design for top header
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FF8559',
          elevation: 0, 
          shadowOpacity: 0, 
        },
        headerTintColor: '#eee', 
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 24,
        },
      }}>
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan QR',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}