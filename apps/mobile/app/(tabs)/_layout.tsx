import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from 'react-native';
import notificationsApi from '../../src/services/notificationsApi';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const getProfileId = async () => {
    const profileId = await AsyncStorage.getItem("profileId");
    setProfileId(profileId);
    return profileId;
  }

  useEffect(() => {
    checkAdminStatus();
    getProfileId()
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchUnreadCount = async () => {
        if (!profileId) return;

        try {
          const data = await notificationsApi.getUnreadCount(profileId);
          setUnreadCount(data.unread_count || 0);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      };

      fetchUnreadCount();
    }, [profileId])
  );

  
  useEffect(() => {
    if (!profileId) return;

    const interval = setInterval(async () => {
      try {
        const data = await notificationsApi.getUnreadCount(profileId);
        setUnreadCount(data.unread_count || 0);
      } catch (error) {
        console.error('Failed to fetch unread count via polling:', error);
      }
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, [profileId]);



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

        ...(route.name === 'profile' || 'search' || 'scan'
          ? {
              // LEFT: "My Profile"
              headerLeft: () => {
                let titleText = '';

                if (route.name === 'profile') {
                  titleText = 'My Profile';
                } else if (route.name === 'search') {
                  titleText = 'Search';
                } else if (route.name === 'scan') {
                  titleText = 'Scan QR';
                } else {
                  titleText = 'App';
                }
                return (
                  <View style={{ marginLeft: 15 }}>
                    <Text
                      style={{
                        color: '#F5F7FB',
                        fontSize: 22,
                        fontWeight: '600',
                      }}
                    >
                      {titleText}
                    </Text>
                  </View>
                )
              },

              // CENTER: Share QR
              headerTitle: () => {
                return (
                  <TouchableOpacity
                    onPress={() => router.push(`/user-profile/${profileId}?scrollToBottom=true`)}
                    style={{
                      padding: 6,
                    }}
                  >
                    <Ionicons
                      name="qr-code-outline"
                      size={24}
                      color="#F5F7FB"
                    />
                  </TouchableOpacity>
                )
              },

              headerTitleAlign: 'center',

              // RIGHT: Notifications + Admin (UNCHANGED)
              headerRight: () => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 15,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => router.push('/notifications')}
                    style={{ paddingHorizontal: 10 }}
                  >
                    <View style={{ position: 'relative' }}>
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color="#F5F7FB"
                      />

                      {unreadCount > 0 && (
                        <View
                          style={{
                            position: 'absolute',
                            top: -4,
                            right: -6,
                            minWidth: 16,
                            height: 16,
                            paddingHorizontal: 4,
                            backgroundColor: '#EF4444',
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontSize: 10,
                              fontWeight: '700',
                            }}
                          >
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>

                  {isAdmin && (
                    <TouchableOpacity
                      onPress={() => router.push('/admin-panel/payments')}
                      style={{ paddingHorizontal: 10 }}
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
                      style={{ paddingHorizontal: 10 }}
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
          : {})

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
