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
    // updateUserProfile: async ({
    //     userId, userName, dob, phoneNumber, headline,
    //     bio, website, connectLinks, videos, locations,
    //     // profilePicFile, coverPhotoFile, profilePicInput, coverPhotoInput,
    // }) => {
    //     try {
    //         const formData = new FormData();

    //         formData.append('userName', userName || '');
    //         formData.append('dob', dob || '');
    //         formData.append('phoneNumber', phoneNumber || '');
    //         formData.append('headline', headline || '');
    //         formData.append('bio', bio || '');
    //         formData.append('websiteUrl', website || '');
    //         // formData.append('connectLinks', JSON.stringify(connectLinks || []));
    //         // formData.append('videos', JSON.stringify(videos || []));
    //         // formData.append('locations', JSON.stringify(locations || []));
    //         connectLinks.forEach((link, index) => {
    //             formData.append(`connectLinks[${index}][id]`, link.id);
    //             formData.append(`connectLinks[${index}][url]`, link.url);
    //             formData.append(`connectLinks[${index}][display_order]`, link.display_order.toString());
    //         });

    //         videos.forEach((video, index) => {
    //             formData.append(`videos[${index}][id]`, video.id);
    //             formData.append(`videos[${index}][video_url]`, video.video_url);
    //             formData.append(`videos[${index}][title]`, video.title);
    //             formData.append(`videos[${index}][description]`, video.description);
    //             formData.append(`videos[${index}][display_order]`, video.display_order.toString());
    //         });

    //         locations.forEach((loc, index) => {
    //             formData.append(`locations[${index}][id]`, loc.id);
    //             formData.append(`locations[${index}][title]`, loc.title);
    //             formData.append(`locations[${index}][country]`, loc.country);
    //             formData.append(`locations[${index}][state]`, loc.state);
    //             formData.append(`locations[${index}][city]`, loc.city);
    //             formData.append(`locations[${index}][street]`, loc.street);
    //             formData.append(`locations[${index}][building]`, loc.building);
    //             formData.append(`locations[${index}][floor]`, loc.floor);
    //         });

    //         // if (profilePicFile) {
    //         //     formData.append('profilePicture', {
    //         //     uri: profilePicFile.uri,
    //         //     type: profilePicFile.type || 'image/jpeg',
    //         //     name: profilePicFile.name || 'profile.jpg',
    //         //     });
    //         // } else {
    //         //     formData.append('profilePhotoPath', profilePicInput || '');
    //         // }

    //         // if (coverPhotoFile) {
    //         //     formData.append('coverPhoto', {
    //         //     uri: coverPhotoFile.uri,
    //         //     type: coverPhotoFile.type || 'image/jpeg',
    //         //     name: coverPhotoFile.name || 'cover.jpg',
    //         //     });
    //         // } else {
    //         //     formData.append('coverPhotoPath', coverPhotoInput || '');
    //         // }
    //         console.log('FormData to send:');
    //         formData.forEach((value, key) => console.log(key, value));

    //         const response = await api.post(`/users/${userId}`, formData);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error updating user profile:', error.message || error);
    //         throw error;
    //     }
    // },
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
    }) => {
        try {
            const formData = new FormData();

            formData.append('userName', userName || '');
            formData.append('dob', dob || '');
            formData.append('phoneNumber', phoneNumber || '');
            formData.append('headline', headline || '');
            formData.append('bio', bio || '');
            formData.append('websiteUrl', website || '');
            formData.append('coverPhotoPath', coverPhotoInput || '');
            formData.append('profilePhotoPath', profilePicInput || '');

            formData.append('connectLinks', JSON.stringify(connectLinks || []));
            formData.append('videos', JSON.stringify(videos || []));
            formData.append('locations', JSON.stringify(locations || []));

            if (profilePicInput && profilePicInput.startsWith('file://')) {
                const filename = profilePicInput.split('/').pop();
                formData.append('profilePicture', {
                    uri: profilePicInput,
                    type: 'image/jpeg',
                    name: filename || 'profile.jpg',
                });
            }

            if (coverPhotoInput && coverPhotoInput.startsWith('file://')) {
                const filename = coverPhotoInput.split('/').pop();
                formData.append('coverPhoto', {
                    uri: coverPhotoInput,
                    type: 'image/jpeg',
                    name: filename || 'cover.jpg',
                });
            }

            console.log('FormData contents:', formData);

            const response = await fetch(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users/${userId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating user profile:', error.message || error);
            throw error;
        }
    },
};