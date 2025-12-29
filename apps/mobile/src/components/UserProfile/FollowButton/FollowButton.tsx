import { profileFollowApi } from "../../../services/profileFollowApi";
import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";

const FollowButton = ({
  currentUserId,
  currentProfileId,
  profileId,
  followers = [],
  following = [],
  fetchUserProfile,
}) => {
  const [isFollower, setIsFollower] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const followerCheck = following.some(f => f.user_id === currentUserId);
    const followingCheck = followers.some(f => f.user_id === currentUserId);
    
    setIsFollower(followerCheck);
    setIsFollowing(followingCheck);
  }, [followers, following, currentUserId]);

  let buttonLabel = "Follow";
  if (isFollower && isFollowing) buttonLabel = "Friends";
  else if (isFollower) buttonLabel = "Follow Back";
  else if (isFollowing) buttonLabel = "Unfollow";

  const buttonStyle = () => {
    switch(buttonLabel) {
      case "Friends": return styles.btnFriends;
      case "Follow Back": return styles.btnFollowBack;
      case "Unfollow": return styles.btnUnfollow;
      default: return styles.btnFollow;
    }
  };

  const textStyle = () => {
    switch(buttonLabel) {
      case "Unfollow": return styles.textUnfollow;
      default: return styles.textDefault;
    }
  };

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFollowing) {
        await profileFollowApi.unfollowUser(currentProfileId, profileId);
        setIsFollowing(false);
        if (isFollower) {
          setIsFollower(false);
        }
      } else {
        await profileFollowApi.followUser(currentProfileId, profileId);
        setIsFollowing(true);
      }
      
      if (fetchUserProfile) {
        fetchUserProfile(profileId);
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      alert(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.followBtn, buttonStyle()]}
      onPress={handleClick}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={buttonLabel === "Unfollow" ? "#f44336" : "white"} 
        />
      ) : (
        <Text style={[styles.buttonText, textStyle()]}>
          {buttonLabel}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  followBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFollow: {
    backgroundColor: '#6B63FF', // muted indigo
  },
  btnFollowBack: {
    backgroundColor: '#BFA5FF', // soft lavender
  },
  btnUnfollow: {
    backgroundColor: 'white',
    borderColor: '#6B63FF', // muted indigo
  },
  btnFriends: {
    backgroundColor: '#9C8DFF', // medium lavender
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textDefault: {
    color: 'white',
  },
  textUnfollow: {
    color: '#6B63FF', // muted indigo
  },
});


export default FollowButton;