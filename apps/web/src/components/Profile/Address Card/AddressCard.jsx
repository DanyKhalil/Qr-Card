import React from 'react';
import './AddressCard.css';

const AddressCard = ({
    title,
    floor,
    building,
    street,
    city,
    state,
    country,
    mapsLink,
    className = "",
    borderColor = "#47855B",
    borderWidth = "4px"
}) => {
    if (!street && !city && !country) {
        return null;
    }

    const handleMapsClick = () => {
        if (mapsLink) {
        window.open(mapsLink, '_blank', 'noopener,noreferrer');
        }
    };

    const MapPinIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
    );

    return (
        <div 
            className={`address-card ${className}`}
            style={{
                borderColor: borderColor,
                borderWidth: borderWidth
            }}
        >
            {title && (
                <div className="card-title">{title}</div>
            )}
            <div className="address-details">
                {floor && (
                <div className="address-line">
                    <span className="label">Floor:</span>
                    <span className="value">{floor}</span>
                </div>
                )}
                
                {building && (
                <div className="address-line">
                    <span className="label">Building:</span>
                    <span className="value">{building}</span>
                </div>
                )}
                
                {street && (
                <div className="address-line">
                    <span className="label">Street:</span>
                    <span className="value">{street}</span>
                </div>
                )}
                
                {city && (
                <div className="address-line">
                    <span className="label">City:</span>
                    <span className="value">{city}</span>
                </div>
                )}
                
                {state && (
                <div className="address-line">
                    <span className="label">State:</span>
                    <span className="value">{state}</span>
                </div>
                )}
                
                {country && (
                <div className="address-line">
                    <span className="label">Country:</span>
                    <span className="value">{country}</span>
                </div>
                )}
            </div>
            {mapsLink && (
                <button 
                className="maps-button"
                onClick={handleMapsClick}
                >
                <span className="maps-icon">
                    <MapPinIcon />
                </span>
                See on Maps
                </button>
            )}
        </div>
    );
};

export default AddressCard;