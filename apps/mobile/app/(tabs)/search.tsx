import { 
  View, Text, TextInput, Pressable, FlatList, ActivityIndicator, 
  Image, StyleSheet, Modal, Switch, TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  
  // Filters
  const [filters, setFilters] = useState({ following: false, followers: false, mutual: false, hasVideos: false });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [profileId, setProfileId] = useState<string | null>(null);

  // ----------------------
  // Load AsyncStorage profileId on mount
  // ----------------------
  useEffect(() => {
    const loadProfileId = async () => {
      try {
        const id = await AsyncStorage.getItem('profileId');
        setProfileId(id);
      } catch (err) {
        console.error('Failed to load profileId from AsyncStorage', err);
      }
    };
    loadProfileId();
  }, []);

  // ----------------------
  // Helper functions
  // ----------------------
  const transformImageUrl = (url: string) => {
    if (!url) return url;
    return url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl);
  };

  // ----------------------
  // Fetch users from backend
  // ----------------------
  const fetchUsers = async (query = '') => {
    if (!profileId) return; // wait until profileId is loaded
    setLoading(true);
    setError('');

    try {
      const filterQuery = [
        filters.following ? 'following' : '',
        filters.followers ? 'followers' : '',
      ].filter(Boolean).join(',');

      const res = await axios.get(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users2/follow`, {
        params: {
          profileId,
          search: query,
          filter: filterQuery,
          mutual: filters.mutual || undefined,
          hasVideos: filters.hasVideos || undefined,
          sort: sortOrder,
        },
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

  // ----------------------
  // Initial fetch when profileId is ready
  // ----------------------
  useEffect(() => {
    if (profileId) fetchUsers(searchQuery);
  }, [profileId]);

  // ----------------------
  // Debounced search
  // ----------------------
  useEffect(() => {
    const delay = setTimeout(() => fetchUsers(searchQuery), 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // ----------------------
  // Fetch whenever filters or sortOrder change
  // ----------------------
  useEffect(() => {
    if (profileId) fetchUsers(searchQuery);
  }, [filters, sortOrder]);

  // ----------------------
  // Render User Card
  // ----------------------
  const renderUserCard = ({ item }) => (
    <Pressable
      onPress={() => router.push(`/(stack)/user-profile/${item.profile_id}`)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.profileImageContainer}>
        {item.profile_pic_url ? (
          <Image
            source={{ uri: transformImageUrl(item.profile_pic_url) }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={28} color="#999" />
          </View>
        )}
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        {item.isFollower && item.isFollowing && <Text style={styles.tagText}>Mutual</Text>}
        {item.isFollowing && !item.isFollower && <Text style={styles.tagText}>Following</Text>}
        {item.isFollower && !item.isFollowing && <Text style={styles.tagText}>Follower</Text>}
      </View>

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
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#64A377" />
        </TouchableOpacity>
      </View>

      {/* Loading / Error / Results */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#64A377" />
          <Text style={styles.loadingText}>Searching users...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="warning-outline" size={40} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => fetchUsers(searchQuery)} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {searchQuery.length > 0 && (
            <Text style={styles.resultsCount}>
              Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </Text>
          )}
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderUserCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#DDD" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No users found' : 'No users available'}
              </Text>
            </View>
          )}
        </>
      )}

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filters</Text>

            <View style={styles.filterItem}>
              <Text>Following</Text>
              <Switch
                value={filters.following}
                onValueChange={(val) => setFilters(prev => ({ ...prev, following: val }))}
              />
            </View>

            <View style={styles.filterItem}>
              <Text>Followers</Text>
              <Switch
                value={filters.followers}
                onValueChange={(val) => setFilters(prev => ({ ...prev, followers: val }))}
              />
            </View>

            <View style={styles.filterItem}>
              <Text>Mutual Followers</Text>
              <Switch
                value={filters.mutual}
                onValueChange={(val) => setFilters(prev => ({ ...prev, mutual: val }))}
              />
            </View>

            <View style={styles.filterItem}>
              <Text>Has Videos</Text>
              <Switch
                value={filters.hasVideos}
                onValueChange={(val) => setFilters(prev => ({ ...prev, hasVideos: val }))}
              />
            </View>

            <View style={styles.filterItem}>
              <Text>Sort A–Z / Z–A</Text>
              <TouchableOpacity onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                <Text style={styles.sortButton}>{sortOrder === 'asc' ? 'A–Z' : 'Z–A'}</Text>
              </TouchableOpacity>
            </View>

            <Pressable style={styles.applyButton} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 16, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  filterButton: { marginLeft: 8 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E8E8E8' },
  cardPressed: { backgroundColor: '#F8F8F8', transform: [{ scale: 0.99 }] },
  profileImageContainer: { marginRight: 12 },
  profileImage: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F0F0' },
  profileImagePlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: '#333' },
  tagText: { fontSize: 12, color: '#64A377', marginTop: 2 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  loadingText: { marginTop: 12, color: '#666', fontSize: 14 },
  errorText: { marginTop: 12, color: '#FF6B6B', fontSize: 16, textAlign: 'center' },
  retryButton: { backgroundColor: '#64A377', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 12 },
  retryButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  resultsCount: { fontSize: 14, color: '#666', marginBottom: 16, textAlign: 'center', backgroundColor: '#F0F7F1', padding: 8, borderRadius: 8 },
  listContent: { paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 16, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  filterItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sortButton: { fontWeight: '600', color: '#64A377' },
  applyButton: { backgroundColor: '#64A377', paddingVertical: 12, borderRadius: 12, marginTop: 12 },
  applyButtonText: { color: '#FFF', textAlign: 'center', fontWeight: '600' },
});