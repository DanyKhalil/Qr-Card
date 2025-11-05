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
import LinkedIn from "../../../assets/images/icons/linkedin-icon-green.png"

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
    name, 
    iconName, 
    link,
    fontSize = '20px',
    className = "",
    iconSize = '24px',
}) => {
    const lowerIcon = iconName?.toLowerCase();
    const iconSrc = iconMap[lowerIcon];

    const handleClick = () => {
        if (!lowerIcon) return;

        switch (lowerIcon) {
            case 'email':
                if (link) window.location.href = `mailto:${link}`;
                else if (name) window.location.href = `mailto:${name}`;
                break;

            case 'phone':
                if (link || name) {
                    const number = (link || name).replace(/\s|-/g, '');
                    window.location.href = `tel:${number}`;
                }
                break;

            case 'whatsapp':
                if (link) {
                    window.open(link, '_blank', 'noopener,noreferrer');
                } else if (name) {
                    const number = name.replace(/\D/g, '');
                    window.open(`https://wa.me/${number}`, '_blank', 'noopener,noreferrer');
                }
                break;

            default:
                if (link) {
                    const url = /^https?:\/\//i.test(link) ? link : `https://${link}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                } else if (name) {
                    const url = /^https?:\/\//i.test(name)
                        ? name
                        : `https://${name}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
                break;
        }
    };

    const isClickable = !!(link || name);
    return (
        <div 
            className={`icon-with-name ${className} ${isClickable ? 'clickable' : ''}`} 
            onClick={isClickable ? handleClick : undefined}
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
        >
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
