import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import UserProfileComponent from '../components/Profile/UserProfile.jsx';
import { userApi } from '../services/userApi.js';
import { profileAnalyticsApi } from '../services/profileAnalyticsApi.js';


const UserProfile = () => {
    // this function returns the token of the logged in user
    const getToken = () => {
        return localStorage.getItem("token");
    };
    // and this returns the user logged in
    const getCurrentUser = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };

    const [searchParams] = useSearchParams();
    
    const currentLoggedInUser = getCurrentUser();
    const { id: urlId } = useParams(); // get visiting user id 
    const id = urlId || currentLoggedInUser?.id; // either a visiting id or a current logged in id
    if (!id) {
        window.location.href = "/login";
        return null;
    }

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
            } catch (err) {
                console.error('Error in visitProfile:', err);
            }
        }
    };

    // the use effect, is to when the component mount, it will call something automatically
    useEffect(() => {
        if (id) {
            fetchUserProfile(id);
            visitProfile(id, qrScan);
        } else {
            setError("User not authenticated");
            setLoading(false);
        }
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

    let contactLinks = [
        {name: userData?.email, iconName: "email", link: userData?.email}, 
        {name: userData?.phone_number, iconName: "phone", link: userData?.phone_number}
    ].filter(link => link.name && String(link.name).trim() !== '');


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
                followers = {userData.followers}
                following = {userData.following}
                id = {id}
                customContent = {userData.custom_content}
                fetchUserProfile = {fetchUserProfile}
                QrCodeColor = {userData.qr_code_color}
            />
        </div>
    );
}

export default UserProfile;