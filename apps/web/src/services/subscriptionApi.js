// services/subscriptionApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api'; // adjust if needed

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

  // **Subscribe and send receipt together**
  subscribeToPlan: async (planId, paymentDetails = {}) => {
    const res = await api.post('/subscription/subscribe', {
      plan_id: planId,
      payment_details: paymentDetails
    });
    return res.data;
  },

  uploadReceipt: async (subscriptionId, receiptFile) => {
    const formData = new FormData();
    formData.append('receipt', receiptFile);
    formData.append('subscription_id', subscriptionId);

    const res = await api.post('/subscription/upload-receipt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return res.data;
  }
};
