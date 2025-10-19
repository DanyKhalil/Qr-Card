import React from 'react';
import './IconWithName.css';

import Whatsapp from "../../../assets/images/icons/whatsapp-icon-green.png"
import Instagram from "../../../assets/images/icons/instagram-icon-green.png"
import Facebook from "../../../assets/images/icons/facebook-icon-green.png"
import Tiktok from "../../../assets/images/icons/tiktok-icon-green.png"
import Youtube from "../../../assets/images/icons/youtube-icon-green.png"
import X from "../../../assets/images/icons/x-icon-green.png"
import Github from "../../../assets/images/icons/github-icon-green.png"
import Phone from "../../../assets/images/icons/phone-icon-green.png"
import Email from "../../../assets/images/icons/email-icon-green.png"
import Web from "../../../assets/images/icons/web-icon-green.png"

const iconMap = {
    whatsapp: Whatsapp,
    facebook: Facebook,
    instagram: Instagram,
    tiktok: Tiktok,
    youtube: Youtube,
    x: X,
    github: Github,
    phone: Phone,
    email: Email,
    web: Web,
};

const IconWithName = ({ 
    name, 
    iconName, 
    fontSize = '20px',
    className = "",
    iconSize = '24px',
}) => {
    const iconSrc = iconMap[iconName?.toLowerCase()];

    return (
        <div className={`icon-with-name ${className}`}>
            {iconSrc && (
                <div className="icon-container">
                    <img 
                        src={iconSrc} 
                        alt={`${iconName} icon`}
                        style={{ 
                            width: iconSize, 
                            height: iconSize 
                        }}
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