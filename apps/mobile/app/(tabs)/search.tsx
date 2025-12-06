import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DEVELOPMENT_CONFIG } from '../../src/config/development'; // same as login

export default function SearchTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users from backend
  const fetchUsers = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users2`, {
        params: { search: query }
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => fetchUsers(searchQuery), 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Search</Text>

      <TextInput
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : error ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(stack)/user-profile/${item.id}`)}
              style={{
                padding: 15,
                backgroundColor: '#f5f5f5',
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16 }}>{item.name}</Text>
              <Text style={{ color: '#666' }}>{item.role || 'No role'}</Text>
              <Text style={{ color: '#666' }}>Tap to view profile</Text>
            </Pressable>
          )}
        />
      ) : (
        <Text>No users found.</Text>
      )}
    </View>
  );
}
