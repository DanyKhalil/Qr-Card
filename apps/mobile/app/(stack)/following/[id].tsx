// app/(stack)/following/[id].tsx
import ProfileListPage from '../../../src/components/UserProfile/ProfileList/ProfileListPage';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { profileFollowApi } from '../../../src/services/profileFollowApi';
import { ActivityIndicator, View, Text } from 'react-native';

export default function FollowingScreen() {
    const { id, profiles: profilesJson } = useLocalSearchParams();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // First, try to use the profiles passed via params
        if (profilesJson) {
            try {
                const parsedProfiles = JSON.parse(profilesJson as string);
                setProfiles(parsedProfiles);
                console.log('Using passed profiles:', parsedProfiles.length);
            } catch (err) {
                console.error("Error parsing profiles:", err);
                // If parsing fails, fetch from API
                fetchFollowingFromApi();
            }
        } else {
            // If no profiles were passed, fetch from API
            fetchFollowingFromApi();
        }
    }, [id, profilesJson]);

    const fetchFollowingFromApi = async () => {
        try {
            setLoading(true);
            const data = await profileFollowApi.getUserFollowStatus(id as string);
            setProfiles(data.following || []);
        } catch (err) {
            console.error("Error fetching following:", err);
            setError("Failed to load following");
            setProfiles([]);
        } finally {
            setLoading(false);
        }
    };

    const refreshFollowing = async () => {
        await fetchFollowingFromApi();
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#64A377" />
                <Text>Loading following...</Text>
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
            title="Following" 
            profiles={profiles}
        />
    );
}