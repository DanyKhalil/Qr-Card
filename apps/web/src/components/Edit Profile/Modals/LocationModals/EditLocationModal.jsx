import React, { useEffect, useState } from 'react';
import "../AddSocialMediaModal/AddSocialMediaModal.css"
import Modal from '../Modal/Modal';
import Button from '../../../Profile/Button/Button';

const EditLocationModal = ({ locationObject, visible, onClose, setter }) => {
    const [title, setTitle] = useState(locationObject.title || '');
    const [floor, setFloor] = useState(locationObject.floor || '');
    const [building, setBuilding] = useState(locationObject.building || '');
    const [street, setStreet] = useState(locationObject.street || '');
    const [city, setCity] = useState(locationObject.city || '');
    const [state, setState] = useState(locationObject.state || '');
    const [country, setCountry] = useState(locationObject.country || '');
    const [mapsUrl, setMapsUrl] = useState(locationObject.maps_url || '');

    const [titleErrorMessage, setTitleErrorMessage] = useState('');
    const [floorErrorMessage, setFloorErrorMessage] = useState('');
    const [buildingErrorMessage, setBuildingErrorMessage] = useState('');
    const [streetErrorMessage, setStreetErrorMessage] = useState('');
    const [cityErrorMessage, setCityErrorMessage] = useState('');
    const [stateErrorMessage, setStateErrorMessage] = useState('');
    const [countryErrorMessage, setCountryErrorMessage] = useState('');
    const [mapsUrlErrorMessage, setMapsUrlErrorMessage] = useState('');

    const [titleIsTouched, setTitleIsTouched] = useState(false);
    const [floorIsTouched, setFloorIsTouched] = useState(false);
    const [buildingIsTouched, setBuildingIsTouched] = useState(false);
    const [streetIsTouched, setStreetIsTouched] = useState(false);
    const [cityIsTouched, setCityIsTouched] = useState(false);
    const [stateIsTouched, setStateIsTouched] = useState(false);
    const [countryIsTouched, setCountryIsTouched] = useState(false);
    const [mapsUrlIsTouched, setMapsUrlIsTouched] = useState(false);

    const validateTitle = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue === '') {
            return 'Title is required';
        }
        if (trimmedValue.length < 2) {
            return 'Title must be at least 2 characters long';
        }
        if (trimmedValue.length > 50) {
            return 'Title must be less than 50 characters';
        }
        return '';
    };

    const validateFloor = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length > 30) {
            return 'Floor must be less than 30 characters';
        }
        return '';
    };

    const validateBuilding = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length > 50) {
            return 'Building must be less than 50 characters';
        }
        return '';
    };

    const validateStreet = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length > 100) {
            return 'Street must be less than 100 characters';
        }
        return '';
    };

    const validateCity = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue === '') {
            return 'City is required';
        }
        if (trimmedValue.length < 2) {
            return 'City must be at least 2 characters long';
        }
        if (trimmedValue.length > 50) {
            return 'City must be less than 50 characters';
        }
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedValue)) {
            return 'City can only contain letters, spaces, hyphens, and apostrophes';
        }
        return '';
    };

    const validateState = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length > 50) {
            return 'State must be less than 50 characters';
        }
        if (trimmedValue && !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedValue)) {
            return 'State can only contain letters, spaces, hyphens, and apostrophes';
        }
        return '';
    };

    const validateCountry = (value) => {
        if (value === '') {
            return 'Country is required';
        }
        return '';
    };

    const validateMapsUrl = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue === '') {
            return '';
        }
        
        // More comprehensive URL pattern that accepts various formats
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?$/;
        if (!urlPattern.test(trimmedValue)) {
            return 'Please enter a valid URL';
        }

        // Expanded maps URL patterns to include Google Maps short URLs and other services
        const mapsPatterns = [
            /maps\.google/,
            /google\.com\/maps/,
            /goo\.gl\/maps/,
            /maps\.app\.goo\.gl/,  // This will match your example URL
            /openstreetmap/,
            /osm\.org/,
            /mapquest/,
            /bing\.com\/maps/,
            /waze\.com/,
            /apple\.com\/maps/,
            /maps\.apple.com/,
            /yandex\.ru\/maps/,
            /2gis/,
            /here\.com/
        ];

        const isMapsUrl = mapsPatterns.some(pattern => pattern.test(trimmedValue));
        if (!isMapsUrl) {
            return 'Please enter a valid maps URL (Google Maps, OpenStreetMap, Apple Maps, etc.)';
        }

        return '';
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        if (titleIsTouched) {
            setTitleErrorMessage(validateTitle(value));
        }
    };

    const handleFloorChange = (e) => {
        const value = e.target.value;
        setFloor(value);
        if (floorIsTouched) {
            setFloorErrorMessage(validateFloor(value));
        }
    };

    const handleBuildingChange = (e) => {
        const value = e.target.value;
        setBuilding(value);
        if (buildingIsTouched) {
            setBuildingErrorMessage(validateBuilding(value));
        }
    };

    const handleStreetChange = (e) => {
        const value = e.target.value;
        setStreet(value);
        if (streetIsTouched) {
            setStreetErrorMessage(validateStreet(value));
        }
    };

    const handleCityChange = (e) => {
        const value = e.target.value;
        setCity(value);
        if (cityIsTouched) {
            setCityErrorMessage(validateCity(value));
        }
    };

    const handleStateChange = (e) => {
        const value = e.target.value;
        setState(value);
        if (stateIsTouched) {
            setStateErrorMessage(validateState(value));
        }
    };

    const handleCountryChange = (e) => {
        const value = e.target.value;
        setCountry(value);
        if (countryIsTouched) {
            setCountryErrorMessage(validateCountry(value));
        }
    };

    const handleMapsUrlChange = (e) => {
        const value = e.target.value;
        setMapsUrl(value);
        if (mapsUrlIsTouched) {
            setMapsUrlErrorMessage(validateMapsUrl(value));
        }
    };

    const handleTitleBlur = () => {
        setTitleIsTouched(true);
        setTitleErrorMessage(validateTitle(title));
    };

    const handleFloorBlur = () => {
        setFloorIsTouched(true);
        setFloorErrorMessage(validateFloor(floor));
    };

    const handleBuildingBlur = () => {
        setBuildingIsTouched(true);
        setBuildingErrorMessage(validateBuilding(building));
    };

    const handleStreetBlur = () => {
        setStreetIsTouched(true);
        setStreetErrorMessage(validateStreet(street));
    };

    const handleCityBlur = () => {
        setCityIsTouched(true);
        setCityErrorMessage(validateCity(city));
    };

    const handleStateBlur = () => {
        setStateIsTouched(true);
        setStateErrorMessage(validateState(state));
    };

    const handleCountryBlur = () => {
        setCountryIsTouched(true);
        setCountryErrorMessage(validateCountry(country));
    };

    const handleMapsUrlBlur = () => {
        setMapsUrlIsTouched(true);
        setMapsUrlErrorMessage(validateMapsUrl(mapsUrl));
    };

    useEffect(() => {
        setTitle(locationObject.title || '');
        setFloor(locationObject.floor || '');
        setBuilding(locationObject.building || '');
        setStreet(locationObject.street || '');
        setCity(locationObject.city || '');
        setState(locationObject.state || '');
        setCountry(locationObject.country || '');
        setMapsUrl(locationObject.maps_url || '');
        
        setTitleErrorMessage('');
        setFloorErrorMessage('');
        setBuildingErrorMessage('');
        setStreetErrorMessage('');
        setCityErrorMessage('');
        setStateErrorMessage('');
        setCountryErrorMessage('');
        setMapsUrlErrorMessage('');
        setTitleIsTouched(false);
        setFloorIsTouched(false);
        setBuildingIsTouched(false);
        setStreetIsTouched(false);
        setCityIsTouched(false);
        setStateIsTouched(false);
        setCountryIsTouched(false);
        setMapsUrlIsTouched(false);
    }, [locationObject]); 

    const handleSubmit = (e) => {
        e.preventDefault();
        
        setTitleIsTouched(true);
        setCityIsTouched(true);
        setCountryIsTouched(true);
        setMapsUrlIsTouched(true);

        const titleError = validateTitle(title);
        const cityError = validateCity(city);
        const countryError = validateCountry(country);
        const mapsUrlError = validateMapsUrl(mapsUrl);

        setTitleErrorMessage(titleError);
        setCityErrorMessage(cityError);
        setCountryErrorMessage(countryError);
        setMapsUrlErrorMessage(mapsUrlError);

        if (titleError || cityError || countryError || mapsUrlError) {
            return;
        }

        if (title.trim() && city.trim() && country.trim()) {
            setter((oldLoc) => 
                oldLoc.map(loc => 
                    loc.id === locationObject.id 
                        ? {
                            ...loc,
                            title: title.trim(),
                            floor: floor.trim(),
                            building: building.trim(),
                            street: street.trim(),
                            city: city.trim(),
                            state: state.trim(),
                            country: country,
                            maps_url: mapsUrl.trim(),
                          }
                        : loc
                )
            );
            onClose();
        }
    };

    const handleCancel = () => {
        // Reset to original values
        setTitle(locationObject.title || '');
        setFloor(locationObject.floor || '');
        setBuilding(locationObject.building || '');
        setStreet(locationObject.street || '');
        setCity(locationObject.city || '');
        setState(locationObject.state || '');
        setCountry(locationObject.country || '');
        setMapsUrl(locationObject.maps_url || '');
        
        // Clear errors
        setTitleErrorMessage('');
        setFloorErrorMessage('');
        setBuildingErrorMessage('');
        setStreetErrorMessage('');
        setCityErrorMessage('');
        setStateErrorMessage('');
        setCountryErrorMessage('');
        setMapsUrlErrorMessage('');
        setTitleIsTouched(false);
        setFloorIsTouched(false);
        setBuildingIsTouched(false);
        setStreetIsTouched(false);
        setCityIsTouched(false);
        setStateIsTouched(false);
        setCountryIsTouched(false);
        setMapsUrlIsTouched(false);
        
        onClose();
    };

    const canSubmit = !titleErrorMessage && !cityErrorMessage && !countryErrorMessage && !mapsUrlErrorMessage && title.trim() && city.trim() && country.trim();

    return (
        <Modal 
            visible={visible} 
            onClose={handleCancel}
            title="Edit Location"
        >
            <form onSubmit={handleSubmit} className="add-social-modal-form">
                <div className="add-social-modal-content">
                    <label htmlFor="title-link" className="add-social-modal-label">
                        Title *
                    </label>
                    <input
                        id="title-link"
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        placeholder="My Office"
                        className={`add-social-modal-input ${titleErrorMessage ? 'add-social-modal-input--error' : ''}`}
                        autoFocus
                    />
                    <div className="add-social-modal-message">
                        {titleErrorMessage ? (
                            <div className="add-social-modal-error">
                                {titleErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="floor" className="add-social-modal-label">
                        Floor
                    </label>
                    <input
                        id="floor"
                        type="text"
                        value={floor}
                        onChange={handleFloorChange}
                        onBlur={handleFloorBlur}
                        placeholder="3rd Floor"
                        className={`add-social-modal-input ${floorErrorMessage ? 'add-social-modal-input--error' : ''}`}
                    />
                    <div className="add-social-modal-message">
                        {floorErrorMessage ? (
                            <div className="add-social-modal-error">
                                {floorErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="building" className="add-social-modal-label">
                        Building
                    </label>
                    <input
                        id="building"
                        type="text"
                        value={building}
                        onChange={handleBuildingChange}
                        onBlur={handleBuildingBlur}
                        placeholder="Building A, Block F"
                        className={`add-social-modal-input ${buildingErrorMessage ? 'add-social-modal-input--error' : ''}`}
                    />
                    <div className="add-social-modal-message">
                        {buildingErrorMessage ? (
                            <div className="add-social-modal-error">
                                {buildingErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="street" className="add-social-modal-label">
                        Street
                    </label>
                    <input
                        id="street"
                        type="text"
                        value={street}
                        onChange={handleStreetChange}
                        onBlur={handleStreetBlur}
                        placeholder="Street Nb. 15"
                        className={`add-social-modal-input ${streetErrorMessage ? 'add-social-modal-input--error' : ''}`}
                    />
                    <div className="add-social-modal-message">
                        {streetErrorMessage ? (
                            <div className="add-social-modal-error">
                                {streetErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="city" className="add-social-modal-label">
                        City *
                    </label>
                    <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={handleCityChange}
                        onBlur={handleCityBlur}
                        placeholder="New York"
                        className={`add-social-modal-input ${cityErrorMessage ? 'add-social-modal-input--error' : ''}`}
                    />
                    <div className="add-social-modal-message">
                        {cityErrorMessage ? (
                            <div className="add-social-modal-error">
                                {cityErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="state" className="add-social-modal-label">
                        State
                    </label>
                    <input
                        id="state"
                        type="text"
                        value={state}
                        onChange={handleStateChange}
                        onBlur={handleStateBlur}
                        placeholder="Florida"
                        className={`add-social-modal-input ${stateErrorMessage ? 'add-social-modal-input--error' : ''}`}
                    />
                    <div className="add-social-modal-message">
                        {stateErrorMessage ? (
                            <div className="add-social-modal-error">
                                {stateErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="country" className="add-social-modal-label">
                        Country *
                    </label>
                    <input
                        id="country"
                        type="text"
                        value={country}
                        onChange={handleCountryChange}
                        onBlur={handleCountryBlur}
                        placeholder="United States"
                        className={`add-social-modal-input ${countryErrorMessage ? 'add-social-modal-input--error' : ''}`}
                    />
                    <div className="add-social-modal-message">
                        {countryErrorMessage ? (
                            <div className="add-social-modal-error">
                                {countryErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="maps-url" className="add-social-modal-label">
                        Maps URL
                    </label>
                    <input
                        id="maps-url"
                        type="url"
                        value={mapsUrl}
                        onChange={handleMapsUrlChange}
                        onBlur={handleMapsUrlBlur}
                        placeholder="https://maps.google.com/your-location"
                        className={`add-social-modal-input ${mapsUrlErrorMessage ? 'add-social-modal-input--error' : ''}`}
                    />
                    <div className="add-social-modal-message">
                        {mapsUrlErrorMessage ? (
                            <div className="add-social-modal-error">
                                {mapsUrlErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="add-social-modal-actions">
                    <Button 
                        text="Cancel"
                        color="coral"
                        action={handleCancel}
                        className="add-social-modal-cancel-btn"
                    />
                    <Button 
                        text="Save Changes"
                        color="green"
                        action={handleSubmit}
                        disabled={!canSubmit}
                        className="add-social-modal-submit-btn"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default EditLocationModal;