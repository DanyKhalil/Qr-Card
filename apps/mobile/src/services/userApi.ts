import api from './api';

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
    }) => {
        try {
            const payload = {
                userName: userName || '',
                dob: dob || '',
                phoneNumber: phoneNumber || '',
                headline: headline || '',
                bio: bio || '',
                websiteUrl: website || '',
                connectLinks: connectLinks || [],
                videos: videos || [],
                locations: locations || [],
            };

            console.log('Payload to send:', payload);

            const response = await api.put(`/users/${userId}/mobile`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating user profile:', error.message || error);
            throw error;
        }
    },
};