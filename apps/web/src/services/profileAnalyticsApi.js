import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// addign an interceptor to add the token in the request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// addign an interceptor to the response in case the token has expierd
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const profileAnalyticsApi = {
    getUserProfileAnalytics: async (id) => {
        try {
            const response = await api.get(`/profile-analytics/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile analytics:', error);
            throw error;
        }
    },
    visitUserProfile: async (id, qrScan = false) => {
        try {
            // Optional: Check if visiting own profile to avoid API call
            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (currentUser && currentUser.id === id) {
                return { message: 'Skipped self-visit' };
            }
            
            const response = await api.post(`/profile-analytics/${id}`, {
                qr_scan: qrScan
            });
            return response.data;
        } catch (error) {
            console.error('Error recording profile visit:', error);
            throw error;
        }
    }
};