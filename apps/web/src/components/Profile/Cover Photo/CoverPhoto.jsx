import React from 'react';
import './CoverPhoto.css';

const CoverPhoto = ({ 
    photo, 
    alt = "Cover photo", 
    className = ""
}) => {
    const defaultCoverIcon = (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
    );


    return (
        <div 
            className={`cover-photo-container ${className}`} 
        >
            <div className="cover-photo-content">
                {photo ? (
                    <img 
                        src={photo} 
                        alt={alt} 
                        className="cover-photo-image"
                    />
                ) : (
                    <div className="cover-photo-default">
                        {defaultCoverIcon}
                        <span className="cover-photo-label">No Cover Photo</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoverPhoto;