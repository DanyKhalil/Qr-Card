// services/notificationsApi.js
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptor to include token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const notificationsApi = {
  // Get user's notifications
  getUserNotifications: async (profileId) => {
    try {
      const response = await api.get('/notifications', {
        params: { profile_id: profileId },
      });
      return response.data;
    } catch (error) {
      console.error("Get notifications API error:", error);
      throw error;
    }
  },

  // Create a notification (admin/backend use)
  createNotification: async (notificationData) => {
    try {
      const response = await api.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error("Create notification API error:", error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error("Mark as read API error:", error);
      throw error;
    }
  },

  // Mark notification as seen
  markAsSeen: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/seen`);
      return response.data;
    } catch (error) {
      console.error("Mark as seen API error:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (profileId) => {
    try {
      const response = await api.put('/notifications/mark-all-read', {
        profile_id: profileId
      });
      return response.data;
    } catch (error) {
      console.error("Mark all as read API error:", error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error("Delete notification API error:", error);
      throw error;
    }
  },

  // Clear all notifications
  clearAllNotifications: async () => {
    try {
      const response = await api.delete('/notifications/clear-all');
      return response.data;
    } catch (error) {
      console.error("Clear all notifications API error:", error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async (profileId) => {
    try {
      const response = await api.get('/notifications/unread-count', {
        params: { profile_id: profileId },
      });
      return response.data;
    } catch (error) {
      console.error("Get unread count API error:", error);
      throw error;
    }
  }
};

export default notificationsApi;