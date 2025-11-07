import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import UserProfileComponent from '../components/Profile/UserProfile.jsx';
import { userApi } from '../services/userApi.js';
import { profileAnalyticsApi } from '../services/profileAnalyticsApi.js';


const UserProfile = () => {
    const [searchParams] = useSearchParams();

    const { id } = useParams();
    const qrScan = searchParams.get('qrScan') === 'true';

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // this one because it is getting visited two times automatically
    const hasVisited = useRef(false);

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
    const visitProfile = async (id, qrScan) => {
        if (!hasVisited.current) {
            hasVisited.current = true;
            try {
                let res = await profileAnalyticsApi.visitUserProfile(id, qrScan);
                console.log(res);
            } catch (err) {
                console.error('Error in visitProfile:', err);
            }
        }
    };

    // the use effect, is to when the component mount, it will call something automatically
    useEffect(() => {
        // We can get the user ID from:
        // 1. URL parameters (if using React Router)
        // 2. Authentication context
        fetchUserProfile(id);
        visitProfile(id, qrScan);
    }, [id, qrScan]);

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
                id = {id}
            />
        </div>
    );
}

export default UserProfile;