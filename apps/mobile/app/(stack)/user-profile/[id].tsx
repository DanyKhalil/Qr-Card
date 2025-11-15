import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import UserProfilePage from '../../../src/pages/UserProfile';

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams();
    
    return (
        <UserProfilePage />
    );
}