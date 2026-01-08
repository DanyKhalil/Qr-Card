// services/profileFollowApi.js
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptor to include token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or your token storage method
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// services/profileFollowApi.js
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
          follower_profile_id: followerProfileId,   // Changed to snake_case
          following_profile_id: followingProfileId  // Changed to snake_case
        }
      });
      return response.data;
    } catch (error) {
      console.error("Unfollow API error:", error);
      throw error;
    }
  },

  // New function to get user's followers and following
  getUserFollowStatus: async (profileId) => {
    try {
      const response = await api.get(`/follow/${profileId}`);
      return response.data;
    } catch (error) {
      console.error("Get follow status API error:", error);
      throw error;
    }
  },

  // Alternative name if you prefer
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