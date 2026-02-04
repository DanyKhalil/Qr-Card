import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const profileAnalyticsApi = {
    getUserProfileAnalytics: async (id: string) => {
        try {
            const response = await api.get(`/profile-analytics/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile analytics:', error);
            throw error;
        }
    },
    visitUserProfile: async (id: string, qrScan: boolean = false) => {
        try {
            const profileId = await AsyncStorage.getItem("profileId")
            const response = await api.post(`/profile-analytics/${id}`, {
                qr_scan: qrScan,
                sender_profile_id: profileId,
            });
            return response.data;
        } catch (error) {
            console.error('Error increment views in profile visit:', error);
            throw error;
        }
    }
};