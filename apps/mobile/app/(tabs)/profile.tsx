import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function ProfileTab() {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadUserFromStorage() {
            try {
                const userString = await AsyncStorage.getItem("user");
                if (userString) {
                    const user = JSON.parse(userString);
                    setUserId(user.id);
                }
            } catch (error) {
                console.error("Error loading user data from storage:", error);
            } finally {
                setLoading(false);
            }
        }
        
        loadUserFromStorage();
    }, []);

    const menuItems = [
        {
            title: 'View My Profile',
            description: 'See how others see your profile',
            onPress: () => userId && router.push(`/(stack)/user-profile/${userId}`),
            iconName: 'person-outline',
            color: '#4C8F66', // Green
        },
        {
            title: 'Edit Profile',
            description: 'Update your personal information',
            onPress: () => userId && router.push(`/(stack)/edit-profile/${userId}`),
            iconName: 'create-outline',
            color: '#FF8E57', // Orange
        },
        {
            title: 'Profile Analytics',
            description: 'View your profile statistics',
            onPress: () => userId && router.push(`/(stack)/profile-analytics/${userId}`),
            iconName: 'bar-chart-outline',
            color: '#45B7D1', // Blue
        },
        {
            title: 'Logout',
            description: 'App preferences and configuration',
            onPress: async () => {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
                router.replace('/(auth)');
            },
            iconName: 'log-out-outline',
            color: '#FF6B6B', // Red
        },
    ];

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

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
                    <View style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                        backgroundColor: `${item.color}20`, // Adds 20 opacity (e.g., #4C8F6620)
                    }}>
                        <Ionicons 
                            name={item.iconName} 
                            size={28} 
                            color={item.color}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                        {item.title}
                        </Text>
                        <Text style={{ color: '#666', fontSize: 14 }}>
                        {item.description}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#999" />
                </Pressable>
            ))}
        </ScrollView>
    );
}