// services/profileFollowApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

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
  followUser: async (followerUserId, followingUserId) => {
    try {
      const response = await api.post('/follow', {
        follower_user_id: followerUserId,  // Changed to snake_case
        following_user_id: followingUserId // Changed to snake_case
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
          follower_user_id: followerUserId,   // Changed to snake_case
          following_user_id: followingUserId  // Changed to snake_case
        }
      });
      return response.data;
    } catch (error) {
      console.error("Unfollow API error:", error);
      throw error;
    }
  }
};