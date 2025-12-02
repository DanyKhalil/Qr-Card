import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Headline.css';
import FollowButton from '../FollowButton/FollowButton';

const Headline = ({ 
    id,          // profile id (user_id)
    name, 
    dob, 
    headline,
    followers = [],
    following = [],
    onProfileRefresh, // callback to refresh profile data
    fetchUserProfile,
}) => {

    const navigate = useNavigate();

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
    
    const loggedInUserId = getCurrentUser()?.id;

    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(dob);

    // Navigate to profile list page
    const handleFollowersClick = () => {
        navigate('/profile-list', { state: { title: 'Followers', profiles: followers } });
    };

    const handleFollowingClick = () => {
        navigate('/profile-list', { state: { title: 'Following', profiles: following } });
    };

    return (
        <div className="profile-header">
            <div className="name-age-container">
                <span className='name'>{name}</span>
                {dob && (<span className="age">{age} years old</span>)}
            </div>
            
            <p className="headline">{headline}</p>

            <div className="follow-stats">
                <span className="followers" onClick={handleFollowersClick} style={{cursor: 'pointer'}}>
                    {followers.length} Follower{followers.length !== 1 ? 's' : ''}
                </span>
                <span className="following" onClick={handleFollowingClick} style={{cursor: 'pointer'}}>
                    {following.length} Following
                </span>
            </div>

            {loggedInUserId && loggedInUserId !== id && (
                <FollowButton
                    currentUserId={loggedInUserId}
                    profileId={id}
                    followers={followers}
                    following={following}
                    onFollowUpdate={onProfileRefresh} // callback to refresh profile
                    fetchUserProfile={fetchUserProfile}
                />
            )}
        </div>
    );
};

export default Headline;
