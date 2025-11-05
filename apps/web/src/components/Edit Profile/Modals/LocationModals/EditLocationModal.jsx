import React, { useEffect, useState } from 'react';
import "../AddSocialMediaModal/AddSocialMediaModal.css"
import Modal from '../Modal/Modal';
import Button from '../../../Profile/Button/Button';

const EditLocationModal = ({ locationObject ,visible, onClose, setter }) => {
    const [title, setTitle] = useState(locationObject.title);
    const [floor, setFloor] = useState(locationObject.floor);
    const [building, setBuilding] = useState(locationObject.building);
    const [street, setStreet] = useState(locationObject.street);
    const [city, setCity] = useState(locationObject.city);
    const [state, setState] = useState(locationObject.state);
    const [country, setCountry] = useState(locationObject.country);
    const [mapsUrl, setMapsUrl] = useState(locationObject.maps_url);

    useEffect(() => {
        setTitle(locationObject.title);
        setFloor(locationObject.floor)
        setBuilding(locationObject.building)
        setStreet(locationObject.street)
        setCity(locationObject.city)
        setState(locationObject.state)
        setCountry(locationObject.country)
        setMapsUrl(locationObject.maps_url)
    }, [locationObject]); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() && city.trim() && country.trim()) {
            setter((oldLoc) => 
                oldLoc.map(loc => 
                    loc.id === locationObject.id 
                        ? {
                            ...loc,
                            title:title,
                            floor:floor,
                            building:building,
                            street:street,
                            city:city,
                            state:state,
                            country:country,
                            maps_url:mapsUrl,
                          }
                        : loc
                )
            );
            setTitle('');
            setFloor('');
            setBuilding('');
            setStreet('');
            setCity('');
            setState('');
            setCountry('');
            setMapsUrl('');
            onClose();
        }
    };

    const handleCancel = () => {
        setTitle('');
        setFloor('');
        setBuilding('');
        setStreet('');
        setCity('');
        setState('');
        setCountry('');
        setMapsUrl('');
        onClose();
    };

    return (
        <Modal 
            visible={visible} 
            onClose={handleCancel}
            title="Edit Location"
        >
            <form onSubmit={handleSubmit} className="add-social-modal-form">
                <div className="add-social-modal-content">
                    <label htmlFor="title-link" className="add-social-modal-label">
                        Title
                    </label>
                    <input
                        id="title-link"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Office"
                        className="add-social-modal-input"
                        autoFocus
                    />
                </div>
                <div className="add-social-modal-content">
                    <label htmlFor="floor" className="add-social-modal-label">
                        Floor
                    </label>
                    <input
                        id="floor"
                        type="text"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        placeholder="This video shows how..."
                        className="add-social-modal-input"
                    />
                </div>
                <div className="add-social-modal-content">
                    <label htmlFor="building" className="add-social-modal-label">
                        Building
                    </label>
                    <input
                        id="building"
                        type="text"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        placeholder="This video shows how..."
                        className="add-social-modal-input"
                    />
                </div>
                <div className="add-social-modal-content">
                    <label htmlFor="street" className="add-social-modal-label">
                        Street
                    </label>
                    <input
                        id="street"
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="This video shows how..."
                        className="add-social-modal-input"
                    />
                </div>
                <div className="add-social-modal-content">
                    <label htmlFor="city" className="add-social-modal-label">
                        City
                    </label>
                    <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="This video shows how..."
                        className="add-social-modal-input"
                    />
                </div>
                <div className="add-social-modal-content">
                    <label htmlFor="state" className="add-social-modal-label">
                        State
                    </label>
                    <input
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="This video shows how..."
                        className="add-social-modal-input"
                    />
                </div>
                <div className="add-social-modal-content">
                    <label htmlFor="country" className="add-social-modal-label">
                        Country
                    </label>
                    <input
                        id="country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="This video shows how..."
                        className="add-social-modal-input"
                    />
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="social-link" className="add-social-modal-label">
                        Maps Url
                    </label>
                    <input
                        id="social-link"
                        type="url"
                        value={mapsUrl}
                        onChange={(e) => setMapsUrl(e.target.value)}
                        placeholder="https://maps.google.com/your-video"
                        className="add-social-modal-input"
                    />
                </div>
                
                
                <div className="add-social-modal-actions">
                    <Button 
                        text = "Cancel"
                        color = "coral"
                        action={handleCancel}
                        className="add-social-modal-cancel-btn"
                    />
                    <Button 
                        text = "Save Changes"
                        color = "green"
                        action={handleSubmit}
                        disabled={!title.trim() || !city.trim() || !country.trim()}
                        className="add-social-modal-cancel-btn"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default EditLocationModal;
