import React from 'react';
import './AddressCards.css';
import AddressCard from '../Address Card/AddressCard';
import Button from '../../Profile/Button/Button';
import { IoPencil, IoTrash, IoAnalytics, IoSave, IoClose, IoAdd } from "react-icons/io5";

const AddressCards = ({ 
    addresses = [],
    setter,
    gap = "30px",
    className = "",
    addAction,
    updateAction,
    objectSetter
}) => {
    // if (!addresses || addresses.length === 0) {
    //     return null;
    // }

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
                        id={address.id}
                        title={address.title}
                        floor={address.floor}
                        building={address.building}
                        street={address.street}
                        city={address.city}
                        state={address.state}
                        country={address.country}
                        googleMapsUrl={address.maps_url}
                        setter={setter}
                        updateAction={updateAction}
                        objectSetter={objectSetter}
                    />
                </div>
                ))}
            </div>
            <br></br>
            <Button text='Add Location' color='green' width='100%' action={addAction} icon={<IoAdd size={18} />}/>
        </div>
    );
};

export default AddressCards;