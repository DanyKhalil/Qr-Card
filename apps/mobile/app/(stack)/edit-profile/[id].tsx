import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function EditProfileScreen() {
    const { id } = useLocalSearchParams();
    
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Edit Profile</Text>
            <Text style={{ marginTop: 10 }}>Editing profile for user: {id}</Text>
            {/* Your edit profile form here */}
        </View>
    );
}