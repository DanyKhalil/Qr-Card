import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEVELOPMENT_CONFIG } from '../config/development';

// adding /api to the end of the baseurl of the backend server to be able to call the apis
const API_BASE_URL = `${DEVELOPMENT_CONFIG.backendBaseUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// this is to add the logged in user id in the request so backend can use it to detect 
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;