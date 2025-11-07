import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

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
            const response = await api.post(`/profile-visit/${id}`, {
                qr_scan: qrScan
            });
            return response.data;
        } catch (error) {
            console.error('Error recording profile visit:', error);
            throw error;
        }
    }
};

export default api;