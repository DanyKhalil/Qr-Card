import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '@/hooks/useAuth';

export default function ProfileTab() {
    // const { user } = useAuth();  // i must change it later to retrieve logged in usre
    const user = {id:'User001'}; // jsut for testing
    
    const menuItems = [
        {
            title: 'View My Profile',
            description: 'See how others see your profile',
            onPress: () => router.push(`/(stack)/user-profile/${user?.id}`),
            iconName: 'person-outline',
        },
        {
            title: 'Edit Profile',
            description: 'Update your personal information',
            onPress: () => router.push(`/(stack)/edit-profile/${user?.id}`),
            iconName: 'create-outline',
        },
        {
            title: 'Profile Analytics',
            description: 'View your profile statistics',
            onPress: () => router.push(`/(stack)/profile-analytics/${user?.id}`),
            iconName: 'bar-chart-outline',
        },
        // {
        //     title: 'Settings',
        //     description: 'App preferences and configuration',
        //     onPress: () => router.push('/modal'), // Using your existing modal
        //     iconName: 'settings-outline',
        // },
    ];

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <Text style={{ color: '#666', marginBottom: 30 }}>Manage your account</Text>

            {menuItems.map((item, index) => (
                <Pressable
                    key={index}
                    onPress={item.onPress}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        backgroundColor: '#f8f8f8',
                        borderRadius: 12,
                        marginBottom: 12,
                    }}
                >
                    <Ionicons 
                        name={item.iconName} 
                        size={30} 
                        style={{marginRight: 20, marginLeft: 0}} 
                        color="#47855B"
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                        {item.title}
                        </Text>
                        <Text style={{ color: '#666', fontSize: 14 }}>
                        {item.description}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 18 }}>›</Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}