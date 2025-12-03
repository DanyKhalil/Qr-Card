// app/(stack)/followers/[id].tsx
import ProfileListPage from '../../../src/components/UserProfile/ProfileList/ProfileListPage';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { profileFollowApi } from '../../../src/services/profileFollowApi';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

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

    if (id) {
      fetchFollowers();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#64A377" />
        <Text style={styles.loadingText}>Loading followers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4a5568',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
});