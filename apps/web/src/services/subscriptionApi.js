// services/subscriptionApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api'; // Update if needed

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

export const subscriptionApi = {
  // Get current user's subscription
  getCurrentSubscription: async () => {
    try {
      const response = await api.get('/subscription/current');
      return response.data;
    } catch (error) {
      console.error("Get current subscription API error:", error);
      throw error;
    }
  },

  // Get list of available subscription plans
  getAvailablePlans: async () => {
    try {
      const response = await api.get('/subscription/plans');
      return response.data;
    } catch (error) {
      console.error("Get available plans API error:", error);
      throw error;
    }
  },

  // Subscribe to a plan
  subscribeToPlan: async (planId, paymentDetails) => {
    try {
      const response = await api.post('/subscription/subscribe', {
        plan_id: planId,              // snake_case for backend
        payment_details: paymentDetails
      });
      return response.data;
    } catch (error) {
      console.error("Subscribe to plan API error:", error);
      throw error;
    }
  },

  // Cancel current subscription
  cancelSubscription: async () => {
    try {
      const response = await api.post('/subscription/cancel');
      return response.data;
    } catch (error) {
      console.error("Cancel subscription API error:", error);
      throw error;
    }
  }
};
