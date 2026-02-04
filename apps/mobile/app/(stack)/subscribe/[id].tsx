import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubscriptionComponent from "../../../src/components/Subscription/SubscriptionComponent";
import { subscriptionApi } from "../../../src/services/subscriptionApi";

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Get profile_id from URL parameters
  const { profile_id } = useLocalSearchParams();
  
  // Extract profileId - handle both string and array cases
  const profileId = Array.isArray(profile_id) ? profile_id[0] : profile_id;

  const getCurrentUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch {
      return null;
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await subscriptionApi.getAvailablePlans();
      setPlans(data.plans || data);

    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to load subscription plans";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const user = await getCurrentUser();
        const token = await getToken();
        
        if (!user || !token) {
          Alert.alert(
            "Authentication Required",
            "Please login to access subscription",
            [
              {
                text: "OK",
                onPress: () => router.replace("/login")
              }
            ]
          );
          return;
        }

        setCurrentUser(user);
        await fetchPlans();
      } catch (err) {
        console.error("Error checking authentication:", err);
        setError("Authentication check failed");
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, []);

  // Debug: log the profileId for verification
  useEffect(() => {
    if (profileId) {
      console.log("Profile ID from URL:", profileId);
    }
  }, [profileId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading subscription plans...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchPlans}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.authText}>Please login to access subscriptions</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SubscriptionComponent
        profileId={profileId} // Pass the profileId from URL
        plans={plans}
        refreshPlans={fetchPlans}
        currentUser={currentUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#4B5563",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  authText: {
    fontSize: 18,
    color: "#2A3550",
    textAlign: "center",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Subscription;