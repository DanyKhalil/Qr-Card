import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminPanel() {
  const adminMenuItems = [
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      onPress: () => router.push('/admin-panel/manage-users'),
      iconName: 'people-outline',
      color: '#4C8F66',
    },
    {
      title: 'Analytics Dashboard',
      description: 'View platform statistics',
      onPress: () => router.push('/admin-panel/analytics'),
      iconName: 'stats-chart-outline',
      color: '#FF8E57',
    },
    {
      title: 'Content Management',
      description: 'Manage platform content',
      onPress: () => router.push('/admin-panel/content'),
      iconName: 'document-text-outline',
      color: '#45B7D1',
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      onPress: () => router.push('/admin-panel/settings'),
      iconName: 'settings-outline',
      color: '#DDA0DD',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* REMOVED the custom header since Stack provides it */}
      
      <View style={styles.subheader}>
        <Text style={styles.subtitle}>Platform Management Dashboard</Text>
      </View>

      {adminMenuItems.map((item, index) => (
        <Pressable
          key={index}
          onPress={item.onPress}
          style={styles.menuItem}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
            <Ionicons 
              name={item.iconName} 
              size={28} 
              color={item.color}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </Pressable>
      ))}

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Quick Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1,234</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>567</Text>
            <Text style={styles.statLabel}>Active Today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>New This Week</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  subheader: {
    marginBottom: 30,
    marginTop: 10, // Add some top margin since header is now from Stack
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4C8F66',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});