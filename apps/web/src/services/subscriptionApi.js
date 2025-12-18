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
  getCurrentSubscription: async () => {
    try {
      const response = await api.get('/subscription/current');
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

  cancelSubscription: async () => {
    try {
      const response = await api.post('/subscription/cancel');
      return response.data;
    } catch (error) {
      console.error("Cancel subscription API error:", error);
      throw error;
    }
  },

  // **FIXED: Send receipt as FormData, not JSON**
  subscribeToPlan: async (planId, paymentDetails = {}, receiptFile = null) => {
    try {
      const formData = new FormData();
      
      // Add JSON data
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
  },

  // **REMOVE THIS - not needed since receipt is part of subscribe**
  // uploadReceipt: async (subscriptionId, receiptFile) => {
  //   // This endpoint doesn't exist on backend
  // }
};