import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#547DAD', // primary
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#F5F7FB', // soft white
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
      }}
    >
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
      <Stack.Screen 
        name="followers/[id]" 
        options={{ title: 'Followers' }} 
      />
      <Stack.Screen 
        name="following/[id]" 
        options={{ title: 'Following' }} 
      />
      <Stack.Screen 
        name="notifications/index" 
        options={{ title: 'Notifications' }} 
      />
    </Stack>
  );
}
