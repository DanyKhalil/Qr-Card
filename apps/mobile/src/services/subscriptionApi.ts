// services/subscriptionApi.js
import axios from 'axios';
import { DEVELOPMENT_CONFIG } from '../config/development';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base URL from config
const api = axios.create({
  baseURL: DEVELOPMENT_CONFIG.backendBaseUrl,
  timeout: 10000,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Token retrieval error:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const subscriptionApi = {
  // Get current subscription
  getCurrentSubscription: async () => {
    try {
      const response = await api.get('/api/subscription/current');
      return response.data;
    } catch (error) {
      console.error("Get current subscription API error:", error);
      throw error;
    }
  },

  // Get available plans
  getAvailablePlans: async () => {
    try {
      const response = await api.get('/api/subscription/plans');
      return response.data;
    } catch (error) {
      console.error("Get available plans API error:", error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      const response = await api.post('/api/subscription/cancel');
      return response.data;
    } catch (error) {
      console.error("Cancel subscription API error:", error);
      throw error;
    }
  },

  // Subscribe to a plan with receipt upload
  subscribeToPlan: async (profileId, planId, paymentDetails = {}, receiptFile = null) => {
    try {
      const formData = new FormData();
      
      // Add JSON data
      formData.append('profile_id', profileId);
      formData.append('plan_id', planId);
      formData.append('payment_details', JSON.stringify(paymentDetails));
      
      // Add receipt file if provided
      if (receiptFile) {
        // Handle mobile file object (from image picker)
        if (receiptFile.uri) {
          const filename = receiptFile.name || `receipt_${Date.now()}.jpg`;
          formData.append('receipt', {
            uri: receiptFile.uri,
            type: receiptFile.type || 'image/jpeg',
            name: filename,
          });
        } 
        // Handle file object (for web compatibility)
        else {
          formData.append('receipt', receiptFile);
        }
      }

      const response = await api.post('/api/subscription/subscribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Increase timeout for file upload
        timeout: 30000,
      });
      
      return response.data;
    } catch (error) {
      console.error("Subscribe to plan API error:", error);
      throw error;
    }
  },

  // Upload receipt for existing subscription (if needed)
  uploadReceipt: async (subscriptionId, receiptFile) => {
    try {
      const formData = new FormData();
      
      // Handle mobile file object
      if (receiptFile.uri) {
        const filename = receiptFile.name || `receipt_${Date.now()}.jpg`;
        formData.append('receipt', {
          uri: receiptFile.uri,
          type: receiptFile.type || 'image/jpeg',
          name: filename,
        });
      } else {
        formData.append('receipt', receiptFile);
      }

      const response = await api.post(`/api/subscription/${subscriptionId}/upload-receipt`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000,
      });
      
      return response.data;
    } catch (error) {
      console.error("Upload receipt API error:", error);
      throw error;
    }
  },

  // Refresh subscription status
  refreshSubscription: async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (response.data.subscription) {
        // Store in AsyncStorage for offline access
        await AsyncStorage.setItem('subscription', JSON.stringify(response.data.subscription));
        return response.data.subscription;
      }
      return null;
    } catch (error) {
      console.error("Refresh subscription API error:", error);
      throw error;
    }
  }
};

// Export default api instance as well for other uses
export default api;