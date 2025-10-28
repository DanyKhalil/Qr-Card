import React from 'react';
import './AddressCards.css';
import AddressCard from '../Address Card/AddressCard';
import Button from '../../Profile/Button/Button';

const AddressCards = ({ 
    addresses = [],
    gap = "30px",
    className = ""
}) => {
    if (!addresses || addresses.length === 0) {
        return null;
    }
    console.log(addresses)

    return (
        <div className={`user-videos-section ${className}`}>
            <h2 className="section-title">
                Addresses
            </h2>
            
            <div 
                className="videos-column"
                style={{ gap: gap }}
            >
                {addresses.map((address, index) => (
                <div key={index} className="video-item">
                    <AddressCard 
                        title={address.title}
                        floor={address.floor}
                        building={address.building}
                        street={address.street}
                        city={address.city}
                        state={address.state}
                        country={address.country}
                        googleMapsUrl={address.maps_url}
                    />
                </div>
                ))}
            </div>
            <br></br>
            <Button text='Add Location' color='green' width='100%' />
        </div>
    );
};

export default AddressCards;