// app/(stack)/followers/[id].tsx
import ProfileListPage from '../../../src/components/UserProfile/ProfileList/ProfileListPage';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { profileFollowApi } from '../../../src/services/profileFollowApi';
import { ActivityIndicator, View, Text } from 'react-native';

export default function FollowersScreen() {
  const { id } = useLocalSearchParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const data = await profileFollowApi.getUserFollowStatus(id as string);
        setProfiles(data.followers || []);
      } catch (err) {
        console.error("Error fetching followers:", err);
        setError("Failed to load followers");
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#64A377" />
        <Text>Loading followers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ProfileListPage 
      title="Followers" 
      profiles={profiles}
    />
  );
}