import { Stack } from 'expo-router';

export default function StackLayout() {
    return (
        <Stack screenOptions={{
            headerShown: true,
            headerStyle: {
                backgroundColor: '#FF8559',
                elevation: 0, 
                shadowOpacity: 0, 
            },
            headerTintColor: '#eee', 
            headerTitleStyle: {
                fontWeight: '600',
                fontSize: 17,
            },
        }}>
            <Stack.Screen 
                name="user-profile/[id]" 
                options={{ title: 'Profile' }} 
            />
            <Stack.Screen 
                name="edit-profile/[id]" 
                options={{ title: 'Edit Profile' }} 
            />
            <Stack.Screen 
                name="profile-analytics/[id]" 
                options={{ title: 'Analytics' }} 
            />
        </Stack>
    );
}