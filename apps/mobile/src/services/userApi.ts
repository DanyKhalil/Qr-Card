import api from './api';
import { DEVELOPMENT_CONFIG } from '../config/development';


export const userApi = {
    getUserProfile: async (userId: string) => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },
    updateUserProfile: async ({
        userId,
        userName,
        dob,
        phoneNumber,
        headline,
        bio,
        website,
        connectLinks,
        videos,
        locations,
        profilePicInput,
        coverPhotoInput,
        customContent,
        customImages = [], // New parameter for custom content images
        qrCodeColor = "#000000",
        qr_code_include_profile_pic = true,
        qr_code_include_contact = true,
        qr_code_include_social = true,
        qr_code_include_website = true,
    }) => {
        try {
            const formData = new FormData();

            // Basic user info - exactly matching web structure
            formData.append('userName', userName || '');
            
            // Format DOB exactly like web version
            let cleanDob = null;
            if (dob && dob !== '' && !isNaN(new Date(dob).getTime())) {
                cleanDob = new Date(dob).toISOString().split("T")[0];
            }
            formData.append('dob', cleanDob || '');
            
            formData.append('phoneNumber', phoneNumber || '');
            formData.append('headline', headline || '');
            formData.append('bio', bio || '');
            formData.append('websiteUrl', website || '');

            // QR code settings - exactly like web
            formData.append('qrCodeColor', qrCodeColor);
            formData.append('qr_code_include_profile_pic', qr_code_include_profile_pic);
            formData.append('qr_code_include_contact', qr_code_include_contact);
            formData.append('qr_code_include_social', qr_code_include_social);
            formData.append('qr_code_include_website', qr_code_include_website);

            // JSON data - exactly like web
            formData.append('connectLinks', JSON.stringify(connectLinks || []));
            formData.append('videos', JSON.stringify(videos || []));
            formData.append('locations', JSON.stringify(locations || []));
            formData.append('customContent', JSON.stringify(customContent || []));

            // Add custom content images - exactly like web naming convention
            customImages.forEach(({ key, file }) => {
                formData.append(`customImage_${key}`, file);
            });

            // Profile picture handling - matching web logic
            if (profilePicInput?.startsWith('file://')) {
                const filename = profilePicInput.split('/').pop();
                formData.append('profilePicture', {
                    uri: profilePicInput,
                    type: 'image/jpeg',
                    name: filename || 'profile.jpg',
                });
            } else {
                formData.append('profilePhotoPath', profilePicInput || '');
            }

            // Cover photo handling - matching web logic
            if (coverPhotoInput?.startsWith('file://')) {
                const filename = coverPhotoInput.split('/').pop();
                formData.append('coverPhoto', {
                    uri: coverPhotoInput,
                    type: 'image/jpeg',
                    name: filename || 'cover.jpg',
                });
            } else {
                formData.append('coverPhotoPath', coverPhotoInput || '');
            }

            const response = await fetch(
                `${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users/${userId}`,
                {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        Accept: 'application/json',
                        // Don't set Content-Type for FormData - let React Native set it automatically
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating user profile:', error.message || error);
            throw error;
        }
    },

    getProfilesByProfileId: async (profileId) => {
        try {
            const response = await api.get(
                `/users/profiles/by-profile/${profileId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching profiles by profile ID:', error);
            throw error;
        }
    },
    createProfileFromProfileId: async (profileId, name) => {
        if (!name) throw new Error("Profile name is required");
        try {
            const response = await api.post(`/users/profiles/create-from/${profileId}`, { name });
            return response.data;
        } catch (error) {
            console.error('Error creating new profile:', error);
            throw error;
        }
    },
    deleteProfileByProfileId: async (profileId) => {
        try {
            const response = await api.delete(
                `/users/profiles/delete/${profileId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting profile:', error);
            throw error;
        }
    }
};