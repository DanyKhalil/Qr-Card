import api from './api'; 

export const profileFollowApi = {
  followUser: async (followerProfileId, followingProfileId) => {
    try {
      const response = await api.post('/follow', {
        follower_profile_id: followerProfileId,  // Changed to snake_case
        following_profile_id: followingProfileId // Changed to snake_case
      });
      return response.data;
    } catch (error) {
      console.error("Follow API error:", error);
      throw error;
    }
  },

  unfollowUser: async (followerProfileId, followingProfileId) => {
    try {
      const response = await api.delete('/follow', {
        data: { 
          follower_profile_id: followerProfileId,  // Changed to snake_case
        following_profile_id: followingProfileId // Changed to snake_case
        }
      });
      return response.data;
    } catch (error) {
      console.error("Unfollow API error:", error);
      throw error;
    }
  },

  getUserFollowStatus: async (profileId) => {
    try {
      const response = await api.get(`/follow/${profileId}`);
      return response.data;
    } catch (error) {
      console.error("Get follow status API error:", error);
      throw error;
    }
  },

  getFollowersAndFollowing: async (profileId) => {
    try {
      const response = await api.get(`/follow/${profileId}`);
      return response.data;
    } catch (error) {
      console.error("Get followers and following API error:", error);
      throw error;
    }
  }
};