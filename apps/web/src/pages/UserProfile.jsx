import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import UserProfileComponent from '../components/Profile/UserProfile.jsx';
import { userApi } from '../services/userApi.js';


const UserProfile = () => {
    const { id } = useParams();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserProfile = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const data = await userApi.getUserProfile(id);
            setUserData(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch user profile');
            console.error('Error in fetchUserProfile:', err);
        } finally {
            setLoading(false);
        }
    };

    // the use effect, is to when the component mount, it will call something automatically
    useEffect(() => {
        // We can get the user ID from:
        // 1. URL parameters (if using React Router)
        // 2. Authentication context
        fetchUserProfile(id);
    }, []);

    if (loading) {
        return (
        <div className="App">
            <div className="loading-container">
                <p>Loading user profile...</p>
            </div>
        </div>
        );
    }

    if (error) {
        return (
            <div className="App">
                <div className="error-container">
                    <p>Error: {error}</p>
                    <button onClick={() => fetchUserProfile('user001')}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    let contactLinks =  [
                            {name:userData.email, iconName: "email", link:userData.email}, 
                            {name:userData.phone_number, iconName:"phone", link:userData.phone_number}
                        ];

    return (    
        <div className="App">
            <UserProfileComponent 
                coverPhoto = {userData.cover_photo_url}
                profilePic = {userData.profile_pic_url}
                userName = {userData.name}
                dob = {userData.dob}
                headline = {userData.headline}
                contactLinks = {contactLinks}
                connectLinks = {userData.social_media_links}
                websiteLink = {userData.website_link}
                bio = {userData.bio}
                videos = {userData.videos_links}
                locations = {userData.locations}
            />
        </div>
    );
}

export default UserProfile;