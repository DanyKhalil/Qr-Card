import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setIsAdmin(user.role === "admin");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        animation: 'shift',
        tabBarActiveTintColor: '#FF571A',
        tabBarActiveBackgroundColor: '#eee',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#FF8559',
          height: 60 + insets.bottom,
        },
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
        // Add conditional header right button for admin
        ...(route.name === 'profile' && isAdmin ? {
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/admin-panel')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="shield-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        } : {}),
      })}>
      
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