import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { userApi } from '../../src/services/userApi';

export default function ProfileTab() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Manage profiles
  const [showManageModal, setShowManageModal] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [addingProfile, setAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  /* ---------------- Load user & profile ---------------- */
  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setUserId(user.id);
        }
        const storedProfileId = await AsyncStorage.getItem('profileId');
        setProfileId(storedProfileId);
      } catch (error) {
        console.error('Error loading user data from storage:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

  /* ---------------- Profiles logic ---------------- */
  const loadProfiles = async () => {
    if (!profileId) return;

    try {
      setLoadingProfiles(true);
      const response = await userApi.getProfilesByProfileId(profileId);
      setProfiles(response.profiles || []);
    } catch (e) {
      console.error('Failed to load profiles:', e);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleSelectProfile = async (id: string) => {
    if (id === profileId) return;

    await AsyncStorage.setItem('profileId', id);
    setProfileId(id);
    setShowManageModal(false);
    router.replace('/(tabs)/profile');
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim() || !profileId) return;

    try {
      const response = await userApi.createProfileFromProfileId(
        profileId,
        newProfileName.trim()
      );

      setProfiles((prev) => [...prev, response.profile]);
      setNewProfileName('');
      setAddingProfile(false);
    } catch {
      Alert.alert('Error', 'Failed to create profile');
    }
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length === 1) return;

    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await userApi.deleteProfileByProfileId(id);

              const remainingProfiles = profiles.filter((p) => p.id !== id);

              // If deleting active profile → switch to another
              if (id === profileId && remainingProfiles.length > 0) {
                const newActiveProfileId = remainingProfiles[0].id;
                await AsyncStorage.setItem('profileId', newActiveProfileId);
                setProfileId(newActiveProfileId);
              }

              setProfiles(remainingProfiles);
              setShowManageModal(false);
              router.replace('/(tabs)/profile');
            } catch {
              Alert.alert('Error', 'Failed to delete profile');
            }
          },
        },
      ]
    );
  };

  /* ---------------- Menu Items (UNCHANGED) ---------------- */
  const menuItems = [
    {
      title: 'View My Profile',
      description: 'See how others see your profile',
      onPress: () =>
        profileId
          ? router.push(`/(stack)/user-profile/${profileId}`)
          : router.replace('/(auth)/login'),
      iconName: 'person-outline',
      color: '#547DAD',
    },
    {
      title: 'Edit Profile',
      description: 'Update your personal information',
      onPress: () =>
        profileId
          ? router.push(`/(stack)/edit-profile/${profileId}`)
          : router.replace('/(auth)/login'),
      iconName: 'create-outline',
      color: '#6B84B8',
    },
    {
      title: 'Profile Analytics',
      description: 'View your profile statistics',
      onPress: () =>
        profileId
          ? router.push(`/(stack)/profile-analytics/${profileId}`)
          : router.replace('/(auth)/login'),
      iconName: 'bar-chart-outline',
      color: '#7A8FB8',
    },
    {
      title: 'Manage Profiles',
      description: 'Add, remove, or switch between your profiles',
      onPress: async () => {
        if (!profileId) {
          router.replace('/(auth)/login');
          return;
        }
        await loadProfiles();
        setShowManageModal(true);
      },
      iconName: 'people-outline',
      color: '#5F7DB8',
    },
    {
      title: profileId ? 'Logout' : 'Login',
      description: profileId
        ? 'Sign out of your account'
        : 'Sign in to access your profile',
      onPress: async () => {
        if (profileId) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('subscription');
          await AsyncStorage.removeItem('profileId');
          router.replace('/(auth)/login');
        } else {
          router.replace('/(auth)/login');
        }
      },
      iconName: profileId ? 'log-out-outline' : 'log-in-outline',
      color: profileId ? '#8B3A3A' : '#547DAD',
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
    <>
      {/* ---------------- EXISTING UI ---------------- */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
            {profileId ? 'My Profile' : 'Profile'}
          </Text>
          <Text style={{ color: '#6B7280' }}>
            {profileId
              ? 'Manage your account and settings'
              : 'Sign in to access your profile features'}
          </Text>
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
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {item.title}
              </Text>
              <Text style={{ color: '#6B7280' }}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9AA4BF" />
          </Pressable>
        ))}
      </ScrollView>

      {/* ---------------- Manage Profiles Modal ---------------- */}
      <Modal visible={showManageModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 16,
              maxHeight: '80%',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
              Manage Profiles
            </Text>

            {loadingProfiles ? (
              <ActivityIndicator />
            ) : (
              <ScrollView>
                {profiles.map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => handleSelectProfile(p.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      borderRadius: 10,
                      marginBottom: 8,
                      backgroundColor:
                        p.id === profileId ? '#b8c7e6ff' : '#F9FAFB',
                    }}
                  >
                    <Ionicons
                      name="person-circle-outline"
                      size={36}
                      color="#547DAD"
                    />
                    <Text style={{ flex: 1, marginLeft: 10 }}>{p.name}</Text>

                    {profiles.length > 1 && (
                      <Pressable onPress={() => handleDeleteProfile(p.id)}>
                        <Ionicons
                          name="close-circle-outline"
                          size={22}
                          color="#C24141"
                        />
                      </Pressable>
                    )}
                  </Pressable>
                ))}

                {addingProfile ? (
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TextInput
                      placeholder="Profile name"
                      value={newProfileName}
                      onChangeText={setNewProfileName}
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#CBD5E1',
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        marginRight: 8,
                      }}
                    />
                    <Pressable
                      onPress={handleCreateProfile}
                      style={{
                        backgroundColor: '#3B82F6',
                        paddingHorizontal: 14,
                        justifyContent: 'center',
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '600' }}>
                        Create
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setAddingProfile(true)}
                    style={{ padding: 12, alignItems: 'center' }}
                  >
                    <Text style={{ fontWeight: '600' }}>
                      + Add another profile
                    </Text>
                  </Pressable>
                )}
              </ScrollView>
            )}

            <Pressable
              onPress={() => setShowManageModal(false)}
              style={{ marginTop: 12, alignSelf: 'center' }}
            >
              <Text style={{ color: '#6B7280' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

