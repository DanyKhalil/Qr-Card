import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { profileFollowApi } from "../../../services/profileFollowApi";
import { DEVELOPMENT_CONFIG } from '../../../../src/config/development';
import { router } from "expo-router";


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProfileList = ({ profiles = [], onProfileClick = () => {} }) => {
  const navigation = useNavigation();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const transformImageUrl = (url: string) => {
    if (!url) 
        return url;
    let transformedUrl = url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl)
    return transformedUrl;
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setLoggedInUserId(user.id);
          return user.id;
        }
        return null;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    };

    const fetchFollowData = async () => {
      const userId = await fetchCurrentUser();
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await profileFollowApi.getUserFollowStatus(userId);
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
      } catch (err) {
        console.error("Error fetching follow data:", err);
        setError("Failed to load follow data");
        setFollowers([]);
        setFollowing([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowData();
  }, []);

  const getRelationshipStatus = (profileUserId) => {
    if (!loggedInUserId || loggedInUserId === profileUserId) return null;

    const isFollowing = following.some((f) => f.user_id === profileUserId);
    const isFollower = followers.some((f) => f.user_id === profileUserId);

    return { isFollowing, isFollower };
  };

  const getButtonLabel = (isFollowing, isFollower) => {
    if (isFollowing && isFollower) return "Friends";
    if (isFollowing) return "Unfollow";
    if (isFollower) return "Follow Back";
    return "Follow";
  };

  const getButtonStyle = (label) => {
    switch (label) {
      case "Friends":
        return styles.btnFriends;
      case "Unfollow":
        return styles.btnUnfollow;
      case "Follow Back":
        return styles.btnFollowBack;
      default:
        return styles.btnFollow;
    }
  };

  const handleFollowAction = async (profileUserId, currentIsFollowing) => {
    if (!loggedInUserId) {
      Alert.alert("Login Required", "Please login to follow users");
      return;
    }

    try {
      if (currentIsFollowing) {
        await profileFollowApi.unfollowUser(loggedInUserId, profileUserId);
        setFollowing((prev) => prev.filter((f) => f.user_id !== profileUserId));
        const wasFollower = followers.some((f) => f.user_id === profileUserId);
        if (wasFollower) {
          setFollowers((prev) => prev.filter((f) => f.user_id !== profileUserId));
        }
      } else {
        await profileFollowApi.followUser(loggedInUserId, profileUserId);
        const profileToFollow = profiles.find((p) => p.user_id === profileUserId);
        if (profileToFollow) {
          setFollowing((prev) => [
            ...prev,
            {
              user_id: profileUserId,
              name: profileToFollow.name,
              profile_pic_url: profileToFollow.profile_pic_url,
              headline: profileToFollow.headline,
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Error in follow action:", err);
      Alert.alert("Error", err.response?.data?.error || "Something went wrong");
    }
  };

  const navigateToProfile = (userId) => {
    router.push(`user-profile/${userId}`)
  };

  if (!profiles.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No profiles to display</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#64A377" />
        <Text style={styles.loadingText}>Loading follow data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profiles</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {profiles.length} {profiles.length === 1 ? "profile" : "profiles"}
          </Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {profiles.map((profile) => {
          const relationship = getRelationshipStatus(profile.user_id);
          const buttonLabel = relationship
            ? getButtonLabel(relationship.isFollowing, relationship.isFollower)
            : null;

          return (
            <TouchableOpacity
              key={profile.follow_id || profile.user_id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigateToProfile(profile.user_id)}
            >
              <View style={styles.cardContent}>
                <View style={styles.profileInfo}>
                  {profile.profile_pic_url ? (
                    <Image
                      source={{ uri: transformImageUrl(profile.profile_pic_url) }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.defaultAvatar}>
                      <Ionicons name="person-outline" size={28} color="#64748b" />
                    </View>
                  )}

                  <View style={styles.profileDetails}>
                    <Text style={styles.name} numberOfLines={1}>
                      {profile.name}
                    </Text>
                    {profile.headline && (
                      <Text style={styles.headline} numberOfLines={1}>
                        {profile.headline}
                      </Text>
                    )}
                  </View>
                </View>

                {relationship && loggedInUserId !== profile.user_id && (
                  <TouchableOpacity
                    style={[styles.followButton, getButtonStyle(buttonLabel)]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleFollowAction(profile.user_id, relationship.isFollowing);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        buttonLabel === "Unfollow" && styles.unfollowText,
                      ]}
                    >
                      {buttonLabel}
                    </Text>
                  </TouchableOpacity>
                )}
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
    backgroundColor: "#ffffff",
    width: SCREEN_WIDTH,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    width: SCREEN_WIDTH,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a202c",
  },
  countBadge: {
    backgroundColor: "#edf2f7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    fontSize: 14,
    color: "#4a5568",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fdf2ee",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    width: SCREEN_WIDTH - 32, // Full width minus padding
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    maxWidth: SCREEN_WIDTH * 0.65, // 65% of screen width for profile info
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  defaultAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileDetails: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 4,
  },
  headline: {
    fontSize: 14,
    color: "#718096",
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  btnFollow: {
    backgroundColor: "#64A377",
  },
  btnUnfollow: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#f44336",
  },
  btnFollowBack: {
    backgroundColor: "#2196F3",
  },
  btnFriends: {
    backgroundColor: "#ff9800",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  unfollowText: {
    color: "#f44336",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    width: SCREEN_WIDTH,
  },
  emptyText: {
    fontSize: 16,
    color: "#718096",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    width: SCREEN_WIDTH,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4a5568",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    width: SCREEN_WIDTH,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
  },
});

export default ProfileList;