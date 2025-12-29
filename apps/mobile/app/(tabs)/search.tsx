import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DEVELOPMENT_CONFIG } from '../../src/config/development';
import { Ionicons } from '@expo/vector-icons';

export default function SearchTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const transformImageUrl = (url: string) => {
      if (!url) 
          return url;
      let transformedUrl = url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl)
      return transformedUrl;
  };

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

  const renderUserCard = ({ item }) => (
    <Pressable
      onPress={() => router.push(`/(stack)/user-profile/${item.profile_id}`)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
    >
      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        {item.profile?.profile_pic_url ? (
          <Image
            source={{ uri: transformImageUrl(item.profile.profile_pic_url) }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={28} color="#999" />
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          {/* {item.verified && (
            <Ionicons 
              name="checkmark-circle" 
              size={16} 
              color="#4C8F66" 
              style={styles.verifiedIcon}
            />
          )} */}
        </View>
        {/* <Text style={styles.roleText}>
          {item.role === 'admin' ? 'Administrator' : 'User'}
        </Text> */}
      </View>

      {/* Arrow Icon */}
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Users</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Search by name..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Loading State */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#64A377" />
          <Text style={styles.loadingText}>Searching users...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={40} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={() => fetchUsers(searchQuery)}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* Results Count */}
          {searchQuery && (
            <Text style={styles.resultsCount}>
              Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </Text>
          )}

          {/* Users List */}
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderUserCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={() => (
                <Text style={styles.resultsHeader}>
                  {searchQuery ? 'Search Results' : 'All Users'}
                </Text>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#DDD" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No users found' : 'No users available'}
              </Text>
              {searchQuery && (
                <Text style={styles.emptySubtext}>
                  Try a different search term
                </Text>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#F8F8F8',
    transform: [{ scale: 0.99 }],
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
  },
  profileImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  verifiedIcon: {
    marginTop: 2,
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  errorText: {
    marginTop: 12,
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#64A377',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#F0F7F1',
    padding: 8,
    borderRadius: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  resultsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 8,
  },
});