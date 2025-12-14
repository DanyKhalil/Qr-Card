import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import UserProfileComponent from '../components/Profile/UserProfile.jsx';
import { userApi } from '../services/userApi.js';
import { profileAnalyticsApi } from '../services/profileAnalyticsApi.js';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const UserProfile = () => {
    const getToken = () => {
        return localStorage.getItem("token");
    };
    
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
    const { id: urlId } = useParams();
    const id = urlId || currentLoggedInUser?.id;
    
    if (!id) {
        window.location.href = "/login";
        return null;
    }

    const qrScan = searchParams.get('qrScan') === 'true';
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasVisited = useRef(false);

    const fetchUserProfile = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const data = await userApi.getUserProfile(id);
            
            // Check if user's visibility is false (account locked)
            if (data.visibility === false) {
                // If account is locked, don't proceed with normal profile loading
                setUserData(data);
                setLoading(false);
                return;
            }
            
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

    useEffect(() => {
        if (id) {
            fetchUserProfile(id);
            visitProfile(id, qrScan);
        } else {
            setError("User not authenticated");
            setLoading(false);
        }
    }, [id, qrScan]);

    // Show locked account page if visibility is false
    if (userData?.visibility === false && getCurrentUser()?.role !== "admin") {
        return (
            <div className="locked-account-page">
                <Header />
                <div className="locked-account-container">
                    <div className="locked-account-content">
                        <div className="locked-icon">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="80" 
                                height="80" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h1 className="locked-title">Account Locked</h1>
                        <p className="locked-message">
                            This account has been temporarily locked due to a violation of our community guidelines.
                        </p>
                        <div className="locked-details">
                            <p>
                                The user's profile is currently unavailable for viewing. This action was taken to 
                                ensure a safe and respectful environment for all members of our community.
                            </p>
                            <p className="locked-contact">
                                If you believe this is a mistake or have any questions, please contact our 
                                <a href="mailto:danikhalil2004@gmail.com" className="support-link"> support team</a>.
                            </p>
                        </div>
                        <div className="locked-actions">
                            <button 
                                className="locked-button primary"
                                onClick={() => history.back()}
                            >
                                Return Back
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
                <style jsx>{`
                    .locked-account-page {
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    }
                    
                    .locked-account-container {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem;
                        margin-top: 80px;
                    }
                    
                    .locked-account-content {
                        max-width: 600px;
                        width: 100%;
                        background: white;
                        border-radius: 20px;
                        padding: 3rem;
                        text-align: center;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                        border: 1px solid #e9ecef;
                    }
                    
                    .locked-icon {
                        margin-bottom: 1.5rem;
                        color: #6c757d;
                        opacity: 0.8;
                    }
                    
                    .locked-title {
                        font-size: 2.5rem;
                        font-weight: 700;
                        color: #343a40;
                        margin-bottom: 1rem;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    }
                    
                    .locked-message {
                        font-size: 1.1rem;
                        color: #dc3545;
                        font-weight: 500;
                        margin-bottom: 2rem;
                        line-height: 1.6;
                    }
                    
                    .locked-details {
                        background: #f8f9fa;
                        border-radius: 12px;
                        padding: 1.5rem;
                        margin-bottom: 2rem;
                        text-align: left;
                    }
                    
                    .locked-details p {
                        color: #6c757d;
                        line-height: 1.7;
                        margin-bottom: 1rem;
                        font-size: 0.95rem;
                    }
                    
                    .locked-details p:last-child {
                        margin-bottom: 0;
                    }
                    
                    .locked-contact {
                        font-style: italic;
                        border-left: 3px solid #007bff;
                        padding-left: 1rem;
                        margin-top: 1rem;
                    }
                    
                    .support-link {
                        color: #007bff;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    
                    .support-link:hover {
                        text-decoration: underline;
                    }
                    
                    .locked-actions {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    
                    .locked-button {
                        padding: 0.875rem 1.75rem;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        border: none;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    }
                    
                    .locked-button.primary {
                        background: #007bff;
                        color: white;
                    }
                    
                    .locked-button.primary:hover {
                        background: #0056b3;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                    }
                    
                    .locked-button.secondary {
                        background: transparent;
                        color: #6c757d;
                        border: 2px solid #dee2e6;
                    }
                    
                    .locked-button.secondary:hover {
                        background: #f8f9fa;
                        border-color: #6c757d;
                        transform: translateY(-2px);
                    }
                    
                    @media (max-width: 768px) {
                        .locked-account-container {
                            padding: 1rem;
                            margin-top: 60px;
                        }
                        
                        .locked-account-content {
                            padding: 2rem;
                        }
                        
                        .locked-title {
                            font-size: 2rem;
                        }
                        
                        .locked-actions {
                            flex-direction: column;
                        }
                        
                        .locked-button {
                            width: 100%;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        .locked-account-content {
                            padding: 1.5rem;
                        }
                        
                        .locked-title {
                            font-size: 1.75rem;
                        }
                        
                        .locked-message {
                            font-size: 1rem;
                        }
                    }
                `}</style>
            </div>
        );
    }

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
                includeProfilePic ={userData.qr_code_include_profile_pic}
                includeContact={userData.qr_code_include_contact}
                includeSocialMedia={userData.qr_code_include_social}
                includeWebsite={userData.qr_code_include_website}
            />
        </div>
    );
}

export default UserProfile;