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
        if (profileData instanceof FormData) {
            console.log("FormData entries:");
            for (let [key, value] of profileData.entries()) {
                console.log(`  ${key}:`, value);
            }
        } else {
            console.log("JSON profileData:", JSON.stringify(profileData, null, 2));
        }

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