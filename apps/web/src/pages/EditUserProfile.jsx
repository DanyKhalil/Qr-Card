import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { userApi } from '../services/userApi.js';
import EditUserProfileComponent from "../components/Edit Profile/EditUserProfile.jsx"


const EditUserProfile = () => {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    

    const currentLoggedInUser = getCurrentUser();
    const { id: urlId } = useParams(); // get visiting user id 
    const id = urlId || currentLoggedInUser?.id; // either a visiting id or a current logged in id
    if (!id) {
        window.location.href = "/login";
        return null;
    }

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
        if (id == currentLoggedInUser?.id){
            fetchUserProfile(id);
        } else if (id != currentLoggedInUser?.id && currentLoggedInUser?.role === 'admin') {
            fetchUserProfile(id);
        }
        else {
            setError("You are not authorized to enter this page.");
            setLoading(false);
        }
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
                    <button onClick={() => fetchUserProfile(id)}>
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
            <EditUserProfileComponent
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
                customContent={userData.custom_content}
                QrCodeColor = {userData.qr_code_color}
                includeProfilePic ={userData.qr_code_include_profile_pic}
                includeContact={userData.qr_code_include_contact}
                includeSocialMedia={userData.qr_code_include_social}
                includeWebsite={userData.qr_code_include_website}
            />
        </div>
    );
}

export default EditUserProfile;