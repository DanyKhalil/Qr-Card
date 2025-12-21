import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function ProfileTab() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error loading user data from storage:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

  const menuItems = [
    {
      title: 'View My Profile',
      description: 'See how others see your profile',
      onPress: () =>
        userId
          ? router.push(`/(stack)/user-profile/${userId}`)
          : router.replace('/(auth)/login'),
      iconName: 'person-outline',
      color: '#547DAD',
    },
    {
      title: 'Edit Profile',
      description: 'Update your personal information',
      onPress: () =>
        userId
          ? router.push(`/(stack)/edit-profile/${userId}`)
          : router.replace('/(auth)/login'),
      iconName: 'create-outline',
      color: '#6B84B8',
    },
    {
      title: 'Profile Analytics',
      description: 'View your profile statistics',
      onPress: () =>
        userId
          ? router.push(`/(stack)/profile-analytics/${userId}`)
          : router.replace('/(auth)/login'),
      iconName: 'bar-chart-outline',
      color: '#7A8FB8',
    },
    {
      title: 'My Plan',
      description: 'View your profile plan',
      onPress: () =>
        userId
          ? router.push(`/(stack)/subscribe/${userId}`)
          : router.replace('/(auth)/login'),
      iconName: 'wallet-outline',
      color: '#7A8FB8',
    },
    {
      title: userId ? 'Logout' : 'Login',
      description: userId
        ? 'Sign out of your account'
        : 'Sign in to access your profile',
      onPress: async () => {
        if (userId) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          router.replace('/(auth)/login');
        } else {
          router.replace('/(auth)/login');
        }
      },
      iconName: userId ? 'log-out-outline' : 'log-in-outline',
      color: userId ? '#8B3A3A' : '#547DAD',
    },
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#547DAD" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <View style={{ marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#2F3A4A',
            marginBottom: 8,
          }}
        >
          {userId ? 'My Profile' : 'Profile'}
        </Text>
        <Text style={{ color: '#6B7280' }}>
          {userId
            ? 'Manage your account and settings'
            : 'Sign in to access your profile features'}
        </Text>

        {!userId && (
          <View
            style={{
              marginTop: 15,
              padding: 12,
              backgroundColor: '#E3E0F3',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#547DAD',
            }}
          >
            <Text style={{ color: '#3F4F7A', fontSize: 14 }}>
              You need to sign in to access all profile features
            </Text>
          </View>
        )}
      </View>

      {menuItems.map((item, index) => (
        <Pressable
          key={index}
          onPress={item.onPress}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: pressed ? '#EEF2FA' : '#F5F7FB',
            borderRadius: 12,
            marginBottom: 12,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
              backgroundColor: `${item.color}20`,
            }}
          >
            <Ionicons name={item.iconName} size={28} color={item.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 4,
                color: '#2F3A4A',
              }}
            >
              {item.title}
            </Text>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>
              {item.description}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9AA4BF" />
        </Pressable>
      ))}

      {!userId && (
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text
            style={{
              color: '#6B7280',
              marginBottom: 15,
              textAlign: 'center',
            }}
          >
            Don't have an account? Create one to save your preferences
          </Text>
          <Pressable
            onPress={() => router.replace('/(auth)/signup')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#486FA0' : '#547DAD',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
