import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AdminStackLayout() {
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
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="#F5F7FB" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: '      Admin Panel',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile')}
              style={{ marginLeft: 0 }}
            >
              <Ionicons name="arrow-back" size={24} color="#F5F7FB" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="payments"
        options={{
          title: '      Payments Panel',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile')}
              style={{ marginLeft: 0 }}
            >
              <Ionicons name="arrow-back" size={24} color="#F5F7FB" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
