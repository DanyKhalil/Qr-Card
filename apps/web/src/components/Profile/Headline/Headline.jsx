import React from 'react';
import './Headline.css';

const Headline = ({ 
    name, 
    dob, 
    headline,
    followers = [],
    following = []
}) => {

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

    const containerClasses = `profile-header`;

    return (
        <div className={containerClasses}>
            <div className="name-age-container">
                <span className='name'>{name}</span>
                {dob && (<span className="age">{age} years old</span>)}
            </div>
            
            <p className="headline">{headline}</p>

            <div className="follow-stats">
                <span className="followers">{followers.length} Follower{followers.length !== 1 ? 's' : ''}</span>
                <span className="following">{following.length} Following</span>
            </div>
        </div>
    );
};

export default Headline;
