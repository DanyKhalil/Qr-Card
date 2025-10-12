import React from 'react';
import './ProfilePic.css';

const ProfilePic = ({ 
        photo, 
        alt = "User profile", 
        size = 60, 
        borderWidth = 3,
        borderColor = "#FF8559",
        className = ""
    }) => {
        const defaultUserIcon = (
            <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        );

        const containerStyle = {
            width: `${size}px`,
            height: `${size}px`,
            border: `${borderWidth}px solid ${borderColor}`,
        };

  return (
        <div className={`profile-circle ${className}`} style={containerStyle}>
            <div className="profile-circle-inner">
                {photo ? 
                    (<img src={photo} alt={alt} className="profile-photo"/>) 
                    : 
                    (<div className="profile-default"> {defaultUserIcon}</div>)
                }
            </div>
        </div>
    );
};

export default ProfilePic;