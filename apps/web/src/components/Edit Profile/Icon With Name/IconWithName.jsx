import React from 'react';
import './IconWithName.css';

import Whatsapp from "../../../assets/images/icons/whatsapp-icon-green.png";
import Instagram from "../../../assets/images/icons/instagram-icon-green.png";
import Facebook from "../../../assets/images/icons/facebook-icon-green.png";
import Tiktok from "../../../assets/images/icons/tiktok-icon-green.png";
import Youtube from "../../../assets/images/icons/youtube-icon-green.png";
import X from "../../../assets/images/icons/x-icon-green.png";
import Github from "../../../assets/images/icons/github-icon-green.png";
import Phone from "../../../assets/images/icons/phone-icon-green.png";
import Email from "../../../assets/images/icons/email-icon-green.png";
import Web from "../../../assets/images/icons/web-icon-green.png";
import LinkedIn from "../../../assets/images/icons/linkedin-icon-green.png";

const iconMap = {
    whatsapp: Whatsapp,
    facebook: Facebook,
    instagram: Instagram,
    tiktok: Tiktok,
    youtube: Youtube,
    x: X,
    twitter: X,
    linkedin: LinkedIn,
    github: Github,
    phone: Phone,
    email: Email,
    web: Web,
};

const IconWithName = ({ 
    id,
    name, 
    iconName, 
    setter,
    fontSize = '20px',
    className = "",
    iconSize = '24px',
}) => {
    const lowerIcon = iconName?.toLowerCase();
    const iconSrc = iconMap[lowerIcon];

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        let confirmation = window.confirm("Are you sure you want to remove this link?")
        if (confirmation) 
            setter((oldLinks) => oldLinks.filter((link)=>(link.id !== id)))
    };

    return (
        <div 
            className={`icon-with-name ${className}`}
        >
            <button 
                className="remove-btn"
                onClick={handleRemoveClick}
                title="Remove"
            >
                ×
            </button>
            {iconSrc && (
                <div className="icon-container">
                    <img 
                        src={iconSrc} 
                        alt={`${iconName} icon`}
                        style={{ width: iconSize, height: iconSize }}
                    />
                </div>
            )}
            <span 
                className="name-text"
                style={{ fontSize }}
            >
                {name}
            </span>
        </div>
    );
};

export default IconWithName;
