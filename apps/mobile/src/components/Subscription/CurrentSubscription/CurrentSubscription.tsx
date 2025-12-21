import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEVELOPMENT_CONFIG } from '../../../config/development';

const CurrentSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load subscription from AsyncStorage
    const loadSubscription = async () => {
      try {
        const subscriptionStr = await AsyncStorage.getItem('subscription');
        if (subscriptionStr) {
          const subscriptionData = JSON.parse(subscriptionStr);
          setSubscription(subscriptionData);
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error("Error parsing subscription from AsyncStorage:", error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();

    // Note: In React Native, we can't listen to AsyncStorage changes globally
    // We'll rely on manual refresh or implement a subscription context/state management

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Refresh subscription from API
  const refreshSubscription = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.subscription) {
        await AsyncStorage.setItem('subscription', JSON.stringify(response.data.subscription));
        setSubscription(response.data.subscription);
        // Trigger update for other components (you might want to use Context/Redux)
        // For now, we'll show an alert
        Alert.alert("Success", "Subscription refreshed successfully!");
      }
    } catch (error) {
      console.error("Error refreshing subscription:", error);
      Alert.alert("Error", error.response?.data?.error || "Failed to refresh subscription");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading Subscription...</Text>
        <Text style={styles.loadingSubText}>Please wait while we load your subscription details.</Text>
      </View>
    );
  }

  if (!subscription || !subscription.plan_name) {
    return (
      <View style={[styles.container, styles.noSubscriptionContainer]}>
        <Text style={styles.title}>No Active Subscription</Text>
        <Text style={styles.subtitle}>You currently do not have an active subscription plan.</Text>
        {/* <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshSubscription}
        >
          <Text style={styles.refreshButtonText}>🔄 Refresh Status</Text>
        </TouchableOpacity> */}
      </View>
    );
  }

  const { plan_name, starts_at, expires_at, status, is_active } = subscription;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status display text
  const getStatusText = (status) => {
    const statusMap = {
      'active': 'Active',
      'pending': 'Pending Approval',
      'expired': 'Expired',
      'cancelled': 'Cancelled',
      'suspended': 'Suspended'
    };
    return statusMap[status] || status;
  };

  // Get border color based on status
  const getStatusBorderColor = (status) => {
    const statusColors = {
      'active': '#4CAF50',
      'expired': '#F44336',
      'pending': '#FF9800',
      'cancelled': '#9E9E9E',
      'suspended': '#FF5722'
    };
    return statusColors[status] || '#2196F3';
  };

  // Check if subscription is about to expire
  const isExpiringSoon = expires_at && 
    status === 'active' && 
    new Date(expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={[
        styles.container,
        { borderLeftColor: getStatusBorderColor(status) }
      ]}>
        <View style={styles.subscriptionHeader}>
          <Text style={styles.planTitle}>{plan_name}</Text>
          {/* <TouchableOpacity
            style={[styles.refreshButton, styles.smallRefreshButton]}
            onPress={refreshSubscription}
          >
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity> */}
        </View>
        
        <View style={[styles.statusBadge, styles[`${status}Badge`]]}>
          <Text style={styles.statusText}>
            Status: <Text style={styles.statusValue}>{getStatusText(status)}</Text>
          </Text>
          {is_active && (
            <View style={styles.activeIndicator}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active</Text>
            </View>
          )}
        </View>
        
        {starts_at && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Started:</Text>
            <Text style={styles.detailValue}>{formatDate(starts_at)}</Text>
          </View>
        )}
        
        {expires_at && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expires:</Text>
            <Text style={styles.detailValue}>{formatDate(expires_at)}</Text>
          </View>
        )}
        
        {/* Show warning if subscription is about to expire */}
        {isExpiringSoon && (
          <View style={styles.expiryWarning}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>Your subscription expires soon!</Text>
          </View>
        )}
        
        {/* Action button based on status */}
        {/* {!is_active && status !== 'pending' && (
          <TouchableOpacity
            style={styles.actionButton}
            // onPress={() => router.navigate('/subscribe')} // Using expo-router like your login
            onPress={() => Alert.alert('Navigation', 'Would navigate to subscription screen')}
          >
            <Text style={styles.actionButtonText}>
              {status === 'expired' ? 'Renew Subscription' : 'Subscribe Now'}
            </Text>
          </TouchableOpacity>
        )} */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderLeftWidth: 6,
  },
  loadingContainer: {
    borderLeftColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  noSubscriptionContainer: {
    borderLeftColor: "#C9C5DA",
    borderLeftWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2A3550",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2A3550",
    marginTop: 20,
    marginBottom: 8,
  },
  loadingSubText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
  },
  subscriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2A3550",
    flex: 1,
  },
  refreshButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallRefreshButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  statusBadge: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#2A3550",
  },
  statusValue: {
    fontWeight: "600",
  },
  activeBadge: {
    backgroundColor: "#E8F5E9",
  },
  pendingBadge: {
    backgroundColor: "#FFF3E0",
  },
  expiredBadge: {
    backgroundColor: "#FFEBEE",
  },
  cancelledBadge: {
    backgroundColor: "#FFEBEE",
  },
  suspendedBadge: {
    backgroundColor: "#FFEBEE",
  },
  activeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  activeText: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 14,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  detailLabel: {
    color: "#757575",
    fontWeight: "500",
    fontSize: 15,
  },
  detailValue: {
    color: "#2A3550",
    fontWeight: "600",
    fontSize: 15,
  },
  expiryWarning: {
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FFB74D",
  },
  warningIcon: {
    fontSize: 16,
  },
  warningText: {
    color: "#E65100",
    fontWeight: "600",
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CurrentSubscription;