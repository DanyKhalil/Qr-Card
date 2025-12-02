import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import UserProfilePage from '../../../src/pages/UserProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function UserProfileScreen() {
    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserData() {
            try {
                const userString = await AsyncStorage.getItem("user");
                if (userString) {
                    const user = JSON.parse(userString);
                    console.log("User:", user);
                    setId(user.id);
                }
            } catch (error) {
                console.error("Error loading user data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadUserData();
    }, []);

    if (loading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!id) {
        return (
            <View>
                <Text>No user data found</Text>
            </View>
        );
    }

    return <UserProfilePage id={id} />;
}