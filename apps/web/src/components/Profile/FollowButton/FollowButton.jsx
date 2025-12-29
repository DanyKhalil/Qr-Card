import React, { useState, useEffect } from "react";
import './FollowButton.css';
import { profileFollowApi } from "../../../services/profileFollowApi";

const FollowButton = ({
  currentUserId,
  currentProfileId,
  profileId,
  followers = [],
  following = [],
  onFollowUpdate, // Add callback prop to refresh parent component
  fetchUserProfile,
}) => {
  const [isFollower, setIsFollower] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize state based on props
  useEffect(() => {
    // Check if current user is in the followers list
    const followerCheck = following.some(f => f.user_id === currentUserId);
    // Check if current user is in the following list
    const followingCheck = followers.some(f => f.user_id === currentUserId);
    
    setIsFollower(followerCheck);
    setIsFollowing(followingCheck);
  }, [followers, following, currentUserId]);

  // Determine button label
  let buttonLabel = "Follow";
  if (isFollower && isFollowing) buttonLabel = "Friends";
  else if (isFollower) buttonLabel = "Follow Back";
  else if (isFollowing) buttonLabel = "Unfollow";

  // Button classes for styling
  const buttonClass = () => {
    switch(buttonLabel) {
      case "Friends": return "btn-friends";
      case "Follow Back": return "btn-follow-back";
      case "Unfollow": return "btn-unfollow";
      default: return "btn-follow";
    }
  };

  // Handle follow/unfollow click
  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFollowing) {
        // unfollow
        await profileFollowApi.unfollowUser(currentProfileId, profileId);
        setIsFollowing(false);
        // If we were mutual friends, update follower status too
        if (isFollower) {
          setIsFollower(false);
        }
      } else {
        // follow
        await profileFollowApi.followUser(currentProfileId, profileId);
        setIsFollowing(true);
        // Check if the other user is already following us to become friends
        if (isFollower) {
          // We're now mutual followers (friends)
        }
      }
      
      // Call the callback to refresh parent component data
      // if (onFollowUpdate) {
      //   onFollowUpdate();
      // }
      if (fetchUserProfile) {
        fetchUserProfile(profileId)
      }
      
    } catch (error) {
      console.error("Error updating follow status:", error);
      alert(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`follow-btn ${buttonClass()}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "..." : buttonLabel}
    </button>
  );
};

export default FollowButton;