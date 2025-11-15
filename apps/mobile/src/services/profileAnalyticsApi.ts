import api from './api';

export const profileAnalyticsApi = {
    visitUserProfile: async (id: string, qrScan: boolean = false) => {
        try {
            const response = await api.post(`/profile-analytics/${id}`, {
                qr_scan: qrScan
            });
            return response.data;
        } catch (error) {
            console.error('Error increment views in profile visit:', error);
            throw error;
        }
    }
};