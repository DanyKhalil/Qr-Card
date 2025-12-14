import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NotificationsList from "./NotificationsList";
import { notificationsApi } from "../../../services/notificationsApi";

const { width } = Dimensions.get("window");

const NotificationsPage = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationsApi.getUserNotifications();
      setNotifications(data.notifications || []);
      // Call API but DON'T update local state
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Only call API, don't update local state
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3AAFA9" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3AAFA9"]}
            tintColor="#3AAFA9"
          />
        }
      >
        <View style={styles.pageContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchNotifications}
                activeOpacity={0.7}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <NotificationsList
              notifications={notifications}
              onMarkAsRead={async (id) => {
                try {
                  // Only call API, don't update local state
                  await notificationsApi.markAsRead(id);
                } catch (err) {
                  console.error("Error marking as read:", err);
                }
              }}
              onDeleteNotification={async (id) => {
                try {
                  await notificationsApi.deleteNotification(id);
                  // Only for delete, update local state since item is removed
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== id)
                  );
                } catch (err) {
                }
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F7FC",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  pageContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
    backgroundColor: "transparent",
    borderRadius: 20,
    width: "100%",
  },
  errorMessage: {
    color: "#BC6C5B",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
  retryButton: {
    backgroundColor: "#3AAFA9",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
    backgroundColor: "transparent",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#64748B",
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
});

export default NotificationsPage;