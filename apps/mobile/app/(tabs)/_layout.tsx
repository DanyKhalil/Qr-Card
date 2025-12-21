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

        tabBarActiveTintColor: '#547DAD',
        tabBarInactiveTintColor: '#7A8FB8',
        tabBarActiveBackgroundColor: '#E3E0F3',

        tabBarStyle: {
          backgroundColor: '#F5F7FB',
          height: 60 + insets.bottom,
        },

        headerShown: true,
        headerStyle: {
          backgroundColor: '#547DAD',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#F5F7FB',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 24,
        },

        ...(route.name === 'profile'
          ? {
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                  {/* Notifications */}
                  <TouchableOpacity
                    onPress={() => router.push('/notifications')}
                    style={{ marginRight: 0, paddingHorizontal: 10, }}
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={24}
                      color="#F5F7FB"
                    />
                  </TouchableOpacity>

                  {/* Admin */}
                  {isAdmin && (
                    <TouchableOpacity 
                      onPress={() => router.push('/admin-panel/payments')}
                      style={{ marginRight: 0, paddingHorizontal: 10}}
                    >
                      <Ionicons
                        name="cash-outline"
                        size={24}
                        color="#F5F7FB"
                      />
                    </TouchableOpacity>
                  )}
                  {isAdmin && (
                    <TouchableOpacity 
                      onPress={() => router.push('/admin-panel')}
                      style={{paddingHorizontal: 10}}
                    >
                      <Ionicons
                        name="shield-outline"
                        size={24}
                        color="#F5F7FB"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ),
            }
          : {}),
      })}
    >
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
