import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams();
    
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>User Profile</Text>
            <Text style={{ marginTop: 10 }}>Viewing profile of user: {id}</Text>
            {/* Your user profile content here */}
        </View>
    );
}