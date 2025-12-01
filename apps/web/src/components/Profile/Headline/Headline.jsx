import React from 'react';
import './Headline.css';
import FollowButton from '../FollowButton/FollowButton';

const Headline = ({ 
    id,          // profile id (user_id)
    name, 
    dob, 
    headline,
    followers = [],
    following = [],
    onProfileRefresh // Add this prop to refresh profile data
}) => {

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

    return (
        <div className="profile-header">
            <div className="name-age-container">
                <span className='name'>{name}</span>
                {dob && (<span className="age">{age} years old</span>)}
            </div>
            
            <p className="headline">{headline}</p>

            <div className="follow-stats">
                <span className="followers">{followers.length} Follower{followers.length !== 1 ? 's' : ''}</span>
                <span className="following">{following.length} Following</span>
            </div>

            {loggedInUserId && loggedInUserId !== id && (
                <FollowButton
                    currentUserId={loggedInUserId}
                    profileId={id}
                    followers={followers}
                    following={following}
                    onFollowUpdate={onProfileRefresh} // Pass refresh callback
                />
            )}
        </div>
    );
};

export default Headline;