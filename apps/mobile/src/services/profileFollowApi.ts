import api from './api'; 

export const profileFollowApi = {
  followUser: async (followerUserId, followingUserId) => {
    try {
      const response = await api.post('/follow', {
        follower_user_id: followerUserId,
        following_user_id: followingUserId
      });
      return response.data;
    } catch (error) {
      console.error("Follow API error:", error);
      throw error;
    }
  },

  unfollowUser: async (followerUserId, followingUserId) => {
    try {
      const response = await api.delete('/follow', {
        data: { 
          follower_user_id: followerUserId,
          following_user_id: followingUserId
        }
      });
      return response.data;
    } catch (error) {
      console.error("Unfollow API error:", error);
      throw error;
    }
  },

  getUserFollowStatus: async (userId) => {
    try {
      const response = await api.get(`/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Get follow status API error:", error);
      throw error;
    }
  },

  getFollowersAndFollowing: async (userId) => {
    try {
      const response = await api.get(`/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Get followers and following API error:", error);
      throw error;
    }
  }
};