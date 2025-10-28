import React from 'react';
import './AddressCard.css';
import Button from '../../Profile/Button/Button';

const AddressCard = ({ 
    title = "",
    floor = "",
    building="",
    street = "",
    city = "",
    state = "",
    country = "",
    googleMapsUrl = "",
    className = "" 
}) => {
    return (
        <div className={`location-card ${className}`}>
            <div className="location-card__content">
                <div className="location-card__field">
                    <label className="location-card__label">Title:</label>
                    <div className="location-card__text-field">
                        {title}
                    </div>
                </div>

                <div className="location-card__address-group">
                    <div className="location-card__field">
                        <label className="location-card__label">Floor:</label>
                        <div className="location-card__text-field">
                            {floor}
                        </div>
                    </div>

                    <div className="location-card__field">
                        <label className="location-card__label">Building:</label>
                        <div className="location-card__text-field">
                            {building}
                        </div>
                    </div>

                    <div className="location-card__field">
                        <label className="location-card__label">Street:</label>
                        <div className="location-card__text-field">
                            {street}
                        </div>
                    </div>

                    <div className="location-card__field">
                        <label className="location-card__label">City:</label>
                        <div className="location-card__text-field">
                            {city}
                        </div>
                    </div>

                    <div className="location-card__field">
                        <label className="location-card__label">State:</label>
                        <div className="location-card__text-field">
                            {state}
                        </div>
                    </div>

                    <div className="location-card__field">
                        <label className="location-card__label">Country:</label>
                        <div className="location-card__text-field">
                            {country}
                        </div>
                    </div>
                </div>

                <div className="location-card__field">
                    <label className="location-card__label">Google Maps URL:</label>
                    <div className="location-card__text-field location-card__url-field">
                        {googleMapsUrl}
                    </div>
                </div>

                <div className="location-card__buttons">
                    <Button text="Edit" color="green" action={()=>alert("edit")} width="100px"/>
                    <Button text="Remove" color="coral" action={()=>alert("remove")} width="100px"/>
                </div>
            </div>
        </div>
    );
};

export default AddressCard;