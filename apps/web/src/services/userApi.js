import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const userApi = {
    getUserProfile: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },
    updateUserProfile: async (userId, profileData) => {
        try {
            const config = profileData instanceof FormData 
                ? {
                    headers: {}
                  }
                : {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                  };
            
            const response = await api.put(`/users/${userId}`, profileData, config);
            return response.data;
        } catch (error) {
            console.error('Error while updating user profile', error);
            throw error;
        }
    }
};

export default api;