import { DEVELOPMENT_CONFIG } from '../../../../src/config/development';
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { User, Eye, Bell } from "lucide-react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const NotificationsList = ({ notifications = [], onNotificationClick = () => {} }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  const transformImageUrl = (url: string) => {
    if (!url) 
        return url;
    let transformedUrl = url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl)
    return transformedUrl;
  };

  // Calculate unread count
  useEffect(() => {
    const unread = notifications.filter((n) => !n.is_read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Start pulse animation for unread dot
  useEffect(() => {
    if (unreadCount > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [unreadCount]);

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type, profilePic) => {
    // If there's a profile picture, use it
    if (profilePic) {
      return (
        <View style={[styles.iconContainer, styles.iconWithProfilePic]}>
          <Image
            source={{ uri: transformImageUrl(profilePic) }}
            style={styles.profilePicIcon}
            resizeMode="cover"
          />
        </View>
      );
    }

    // Otherwise show icon with colored background
    switch (type) {
      case "new_follower":
        return (
          <View style={[styles.iconContainer, styles.followerIcon]}>
            <User size={20} color="#FFF" />
          </View>
        );
      case "profile_visit":
        return (
          <View style={[styles.iconContainer, styles.visitIcon]}>
            <Eye size={20} color="#FFF" />
          </View>
        );
      default:
        return (
          <View style={[styles.iconContainer, styles.defaultIcon]}>
            <User size={20} color="#FFF" />
          </View>
        );
    }
  };

  // Get notification title
  const getNotificationTitle = (type) => {
    switch (type) {
      case "new_follower":
        return { text: "New Follower", color: "#64A377" };
      case "profile_visit":
        return { text: "Profile Visit", color: "#2196F3" };
      default:
        return { text: "Notification", color: "#9C27B0" };
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    onNotificationClick(notification);

    // Navigate to sender's profile if available
    if (notification.sender?.id) {
      router.push(`/user-profile/${notification.sender.user_id}`)
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3AAFA9" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  if (!notifications.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>0</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>
            When you get notifications, they'll appear here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount} unread</Text>
            </View>
          )}
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{notifications.length}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification) => {
          const titleInfo = getNotificationTitle(notification.type);
          const isUnread = !notification.is_read;
          const profilePic = notification.sender?.profile_pic_url;

          return (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                isUnread && styles.unreadCard,
              ]}
              onPress={() => handleNotificationClick(notification)}
              activeOpacity={0.7}
            >
              <View style={styles.notificationIndicator}>
                {isUnread && (
                  <Animated.View
                    style={[
                      styles.unreadDot,
                      {
                        opacity: pulseAnim,
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  />
                )}
                {getNotificationIcon(notification.type, profilePic)}
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text
                    style={[
                      styles.notificationType,
                      { color: titleInfo.color },
                    ]}
                  >
                    {titleInfo.text}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {getTimeAgo(notification.created_at)}
                  </Text>
                </View>

                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 20,
    marginVertical: 20,
    marginHorizontal: 16,
    shadowColor: "#3B4A99",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 5,
    width: '100%',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C2F48",
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  countBadge: {
    backgroundColor: "#3AAFA9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
  unreadBadge: {
    backgroundColor: "#BC6C5B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
  notificationsList: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  unreadCard: {
    backgroundColor: "#EDF2FF",
    borderColor: "#DBEAFE",
  },
  notificationIndicator: {
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: -4,
    left: -4,
    width: 10,
    height: 10,
    backgroundColor: "#BC6C5B",
    borderRadius: 5,
    zIndex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  iconWithProfilePic: {
    overflow: "hidden",
  },
  profilePicIcon: {
    width: "100%",
    height: "100%",
  },
  followerIcon: {
    backgroundColor: "#3AAFA9",
  },
  visitIcon: {
    backgroundColor: "#5A6FC1",
  },
  defaultIcon: {
    backgroundColor: "#6D4CAB",
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationType: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
  notificationTime: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
  notificationMessage: {
    marginTop: 4,
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
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
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "-apple-system",
      android: "Roboto",
      default: "System",
    }),
  },
});

export default NotificationsList;