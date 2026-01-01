import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import UserProfilePage from '../../../src/pages/UserProfile';
import { useEffect, useState } from 'react';

export default function UserProfileScreen() {
    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useLocalSearchParams();

    console.log("LOADING: ", loading)

    useEffect(() => {
        function loadUserData() {
            try {
                // ONLY check URL params (no local storage)
                const userIdFromParams = params.userId || params.id;
                
                if (userIdFromParams) {
                    setId(String(userIdFromParams));
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadUserData();
    }, [params]);

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