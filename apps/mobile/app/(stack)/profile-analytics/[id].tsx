import ProfileAnalytics from '@/src/components/ProfileAnalytics/ProfileAnalytics';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams();
    
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <ProfileAnalytics userId={id} />
        </View>
    );
}