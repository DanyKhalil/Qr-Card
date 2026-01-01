import React, { useState, useEffect } from "react";
import { IoPersonOutline } from "react-icons/io5";
import './ProfileList.css';
import { useNavigate } from "react-router-dom";
import { profileFollowApi } from "../../../services/profileFollowApi";

const ProfileList = ({ profiles = [], onProfileClick = () => {} }) => {
  const navigate = useNavigate();
  
  // States for current user's follow data
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };
  const getCurrentUserProfileId = () => {
    const profileId = localStorage.getItem("profileId");
    return profileId;
  }
  
  const loggedInUserId = getCurrentUser()?.id;
  const loggedInUserProfileId = getCurrentUserProfileId();

  // Fetch current user's followers and following on component mount
  useEffect(() => {
    const fetchFollowData = async () => {
      if (!loggedInUserId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await profileFollowApi.getUserFollowStatus(loggedInUserProfileId);
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
  }, [loggedInUserId]);

  // Helper function to check follow relationship for a specific profile
  const getRelationshipStatus = (profileUserId) => {
    if (!loggedInUserProfileId || loggedInUserProfileId === profileUserId) return null;
    // Check if current user follows this profile
    const isFollowing = following.some(f => f.profile_id === profileUserId);
    // Check if this profile follows current user
    const isFollower = followers.some(f => f.profile_id === profileUserId);
    
    return { isFollowing, isFollower };
  };

  // Determine button label based on relationship
  const getButtonLabel = (isFollowing, isFollower) => {
    if (isFollowing && isFollower) return "Friends";
    if (isFollowing) return "Unfollow";
    if (isFollower) return "Follow Back";
    return "Follow";
  };

  // Handle follow/unfollow action
  const handleFollowAction = async (profileUserId, currentIsFollowing) => {
    if (!loggedInUserProfileId) {
      alert("Please login to follow users");
      return;
    }

    try {
      if (currentIsFollowing) {
        // Unfollow
        await profileFollowApi.unfollowUser(loggedInUserProfileId, profileUserId);
        // Update local state - remove from following
        setFollowing(prev => prev.filter(f => f.profile_id !== profileUserId));
        // If they were friends, update followers status
        const wasFollower = followers.some(f => f.profile_id === profileUserId);
        if (wasFollower) {
          // They still follow us, so just update local state
          setFollowers(prev => prev.filter(f => f.profile_id !== profileUserId));
        }
      } else {
        // Follow
        await profileFollowApi.followUser(loggedInUserProfileId, profileUserId);
        // Add to following (we don't have full profile data, so add a placeholder)
        const profileToFollow = profiles.find(p => p.profile_id === profileUserId);
        if (profileToFollow) {
          setFollowing(prev => [...prev, {
            profile_id: profileUserId,
            name: profileToFollow.name,
            profile_pic_url: profileToFollow.profile_pic_url,
            headline: profileToFollow.headline
          }]);
        }
      }
    } catch (err) {
      console.error("Error in follow action:", err);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  if (!profiles.length) {
    return (
      <div className="profile-visits-table no-visits">
        <p>No profiles to display</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-visits-table">
        <div className="table-header">
          <h3>Profiles</h3>
        </div>
        <div className="loading-state">
          <p>Loading follow data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-visits-table">
        <div className="table-header">
          <h3>Profiles</h3>
        </div>
        <div className="error-state">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-visits-table">
      <div className="table-header">
        <h3>Profiles</h3>
        <span className="visits-count">{profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'}</span>
      </div>

      <div className="visits-container">
        {profiles.map((profile) => {
          const relationship = getRelationshipStatus(profile.profile_id);
          const buttonLabel = relationship ? getButtonLabel(relationship.isFollowing, relationship.isFollower) : null;
          
          return (
            <div key={profile.follow_id || profile.user_id} className="visit-card">
              <div 
                className="visitor-info"
                onClick={() => navigate(`/profile/${profile.profile_id}`)}
              >
                {profile.profile_pic_url ? (
                  <img
                    src={profile.profile_pic_url}
                    alt={profile.name}
                    className="visitor-avatar"
                  />
                ) : (
                  <div className="anonymous-avatar">
                    <IoPersonOutline />
                  </div>
                )}

                <div className="visitor-details">
                  <h4 className="visitor-name">{profile.name}</h4>
                  {profile.headline && <p className="visit-time">{profile.headline}</p>}
                </div>
              </div>
              
              {/* Follow button (only if not viewing own profile) */}
              {relationship && loggedInUserProfileId !== profile.id && (
                <button
                  className={`follow-button ${buttonLabel?.toLowerCase().replace(' ', '-')}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowAction(profile.profile_id, relationship.isFollowing);
                  }}
                >
                  {buttonLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileList;