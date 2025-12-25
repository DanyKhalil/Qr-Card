// services/subscriptionApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const subscriptionApi = {
  // profileId must be passed here
  getCurrentSubscription: async (profileId) => {
    try {
      const response = await api.get('/subscription/current', {
        params: { profile_id: profileId } // pass profile_id as query param
      });
      return response.data;
    } catch (error) {
      console.error("Get current subscription API error:", error);
      throw error;
    }
  },

  getAvailablePlans: async () => {
    try {
      const response = await api.get('/subscription/plans');
      return response.data;
    } catch (error) {
      console.error("Get available plans API error:", error);
      throw error;
    }
  },

  cancelSubscription: async (profileId) => {
    try {
      const response = await api.post('/subscription/cancel', { profile_id: profileId });
      return response.data;
    } catch (error) {
      console.error("Cancel subscription API error:", error);
      throw error;
    }
  },

  // Send profile_id in the body along with plan and receipt
  subscribeToPlan: async (profileId, planId, paymentDetails = {}, receiptFile = null) => {
    try {
      const formData = new FormData();
      
      // Add profile_id
      formData.append('profile_id', profileId);

      // Add plan and payment details
      formData.append('plan_id', planId);
      formData.append('payment_details', JSON.stringify(paymentDetails));
      
      // Add receipt file if provided
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }

      const response = await api.post('/subscription/subscribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Subscribe to plan API error:", error);
      throw error;
    }
  }
};