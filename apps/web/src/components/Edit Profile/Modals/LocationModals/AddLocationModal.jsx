import React, { useState } from 'react';
import "../AddSocialMediaModal/AddSocialMediaModal.css"
import Modal from '../Modal/Modal';
import Button from '../../../Profile/Button/Button';

const AddLocationModal = ({ visible, onClose, setter }) => {
    const [title, setTitle] = useState('');
    const [floor, setFloor] = useState('');
    const [building, setBuilding] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [mapsUrl, setMapsUrl] = useState('');

    // Error states
    const [titleErrorMessage, setTitleErrorMessage] = useState('');
    const [floorErrorMessage, setFloorErrorMessage] = useState('');
    const [buildingErrorMessage, setBuildingErrorMessage] = useState('');
    const [streetErrorMessage, setStreetErrorMessage] = useState('');
    const [cityErrorMessage, setCityErrorMessage] = useState('');
    const [stateErrorMessage, setStateErrorMessage] = useState('');
    const [countryErrorMessage, setCountryErrorMessage] = useState('');
    const [mapsUrlErrorMessage, setMapsUrlErrorMessage] = useState('');

    // Touched states
    const [titleIsTouched, setTitleIsTouched] = useState(false);
    const [floorIsTouched, setFloorIsTouched] = useState(false);
    const [buildingIsTouched, setBuildingIsTouched] = useState(false);
    const [streetIsTouched, setStreetIsTouched] = useState(false);
    const [cityIsTouched, setCityIsTouched] = useState(false);
    const [stateIsTouched, setStateIsTouched] = useState(false);
    const [countryIsTouched, setCountryIsTouched] = useState(false);
    const [mapsUrlIsTouched, setMapsUrlIsTouched] = useState(false);

    // Validation functions
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

    // Change handlers
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

    // Blur handlers
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        setTitleIsTouched(true);
        setCityIsTouched(true);
        setCountryIsTouched(true);
        setMapsUrlIsTouched(true);

        // Validate all fields
        const titleError = validateTitle(title);
        const cityError = validateCity(city);
        const countryError = validateCountry(country);
        const mapsUrlError = validateMapsUrl(mapsUrl);

        setTitleErrorMessage(titleError);
        setCityErrorMessage(cityError);
        setCountryErrorMessage(countryError);
        setMapsUrlErrorMessage(mapsUrlError);

        // Check if there are any errors
        if (titleError || cityError || countryError || mapsUrlError) {
            return;
        }

        if (title.trim() && city.trim() && country.trim()) {
            setter((oldVideos) => [...oldVideos, 
                {
                    id: crypto.randomUUID(),
                    title: title.trim(),
                    floor: floor.trim(),
                    building: building.trim(),
                    street: street.trim(),
                    city: city.trim(),
                    state: state.trim(),
                    country: country,
                    maps_url: mapsUrl.trim(),
                }
            ]);
            // Reset all states
            setTitle('');
            setFloor('');
            setBuilding('');
            setStreet('');
            setCity('');
            setState('');
            setCountry('');
            setMapsUrl('');
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

    const countries = [
        { code: 'US', name: 'United States of America' },
        { code: 'AF', name: 'Afghanistan' },
        { code: 'AL', name: 'Albania' },
        { code: 'DZ', name: 'Algeria' },
        { code: 'AS', name: 'American Samoa' },
        { code: 'AD', name: 'Andorra' },
        { code: 'AO', name: 'Angola' },
        { code: 'AI', name: 'Anguilla' },
        { code: 'AQ', name: 'Antarctica' },
        { code: 'AG', name: 'Antigua and Barbuda' },
        { code: 'AR', name: 'Argentina' },
        { code: 'AM', name: 'Armenia' },
        { code: 'AW', name: 'Aruba' },
        { code: 'AU', name: 'Australia' },
        { code: 'AT', name: 'Austria' },
        { code: 'AZ', name: 'Azerbaijan' },
        { code: 'BS', name: 'Bahamas' },
        { code: 'BH', name: 'Bahrain' },
        { code: 'BD', name: 'Bangladesh' },
        { code: 'BB', name: 'Barbados' },
        { code: 'BY', name: 'Belarus' },
        { code: 'BE', name: 'Belgium' },
        { code: 'BZ', name: 'Belize' },
        { code: 'BJ', name: 'Benin' },
        { code: 'BM', name: 'Bermuda' },
        { code: 'BT', name: 'Bhutan' },
        { code: 'BO', name: 'Bolivia' },
        { code: 'BA', name: 'Bosnia and Herzegovina' },
        { code: 'BW', name: 'Botswana' },
        { code: 'BR', name: 'Brazil' },
        { code: 'BN', name: 'Brunei Darussalam' },
        { code: 'BG', name: 'Bulgaria' },
        { code: 'BF', name: 'Burkina Faso' },
        { code: 'BI', name: 'Burundi' },
        { code: 'CV', name: 'Cabo Verde' },
        { code: 'KH', name: 'Cambodia' },
        { code: 'CM', name: 'Cameroon' },
        { code: 'CA', name: 'Canada' },
        { code: 'KY', name: 'Cayman Islands' },
        { code: 'CF', name: 'Central African Republic' },
        { code: 'TD', name: 'Chad' },
        { code: 'CL', name: 'Chile' },
        { code: 'CN', name: 'China' },
        { code: 'CO', name: 'Colombia' },
        { code: 'KM', name: 'Comoros' },
        { code: 'CG', name: 'Congo' },
        { code: 'CD', name: 'Congo, Democratic Republic of the' },
        { code: 'CK', name: 'Cook Islands' },
        { code: 'CR', name: 'Costa Rica' },
        { code: 'CI', name: "Côte d'Ivoire" },
        { code: 'HR', name: 'Croatia' },
        { code: 'CU', name: 'Cuba' },
        { code: 'CY', name: 'Cyprus' },
        { code: 'CZ', name: 'Czech Republic' },
        { code: 'DK', name: 'Denmark' },
        { code: 'DJ', name: 'Djibouti' },
        { code: 'DM', name: 'Dominica' },
        { code: 'DO', name: 'Dominican Republic' },
        { code: 'EC', name: 'Ecuador' },
        { code: 'EG', name: 'Egypt' },
        { code: 'SV', name: 'El Salvador' },
        { code: 'GQ', name: 'Equatorial Guinea' },
        { code: 'ER', name: 'Eritrea' },
        { code: 'EE', name: 'Estonia' },
        { code: 'SZ', name: 'Eswatini' },
        { code: 'ET', name: 'Ethiopia' },
        { code: 'FK', name: 'Falkland Islands (Malvinas)' },
        { code: 'FO', name: 'Faroe Islands' },
        { code: 'FJ', name: 'Fiji' },
        { code: 'FI', name: 'Finland' },
        { code: 'FR', name: 'France' },
        { code: 'GF', name: 'French Guiana' },
        { code: 'PF', name: 'French Polynesia' },
        { code: 'GA', name: 'Gabon' },
        { code: 'GM', name: 'Gambia' },
        { code: 'GE', name: 'Georgia' },
        { code: 'DE', name: 'Germany' },
        { code: 'GH', name: 'Ghana' },
        { code: 'GI', name: 'Gibraltar' },
        { code: 'GR', name: 'Greece' },
        { code: 'GL', name: 'Greenland' },
        { code: 'GD', name: 'Grenada' },
        { code: 'GP', name: 'Guadeloupe' },
        { code: 'GU', name: 'Guam' },
        { code: 'GT', name: 'Guatemala' },
        { code: 'GG', name: 'Guernsey' },
        { code: 'GN', name: 'Guinea' },
        { code: 'GW', name: 'Guinea-Bissau' },
        { code: 'GY', name: 'Guyana' },
        { code: 'HT', name: 'Haiti' },
        { code: 'HN', name: 'Honduras' },
        { code: 'HK', name: 'Hong Kong' },
        { code: 'HU', name: 'Hungary' },
        { code: 'IS', name: 'Iceland' },
        { code: 'IN', name: 'India' },
        { code: 'ID', name: 'Indonesia' },
        { code: 'IR', name: 'Iran' },
        { code: 'IQ', name: 'Iraq' },
        { code: 'IE', name: 'Ireland' },
        { code: 'IM', name: 'Isle of Man' },
        { code: 'IL', name: 'Israel' },
        { code: 'IT', name: 'Italy' },
        { code: 'JM', name: 'Jamaica' },
        { code: 'JP', name: 'Japan' },
        { code: 'JE', name: 'Jersey' },
        { code: 'JO', name: 'Jordan' },
        { code: 'KZ', name: 'Kazakhstan' },
        { code: 'KE', name: 'Kenya' },
        { code: 'KI', name: 'Kiribati' },
        { code: 'KP', name: "Korea, Democratic People's Republic of" },
        { code: 'KR', name: 'Korea, Republic of' },
        { code: 'KW', name: 'Kuwait' },
        { code: 'KG', name: 'Kyrgyzstan' },
        { code: 'LA', name: "Lao People's Democratic Republic" },
        { code: 'LV', name: 'Latvia' },
        { code: 'LB', name: 'Lebanon' },
        { code: 'LS', name: 'Lesotho' },
        { code: 'LR', name: 'Liberia' },
        { code: 'LY', name: 'Libya' },
        { code: 'LI', name: 'Liechtenstein' },
        { code: 'LT', name: 'Lithuania' },
        { code: 'LU', name: 'Luxembourg' },
        { code: 'MO', name: 'Macao' },
        { code: 'MG', name: 'Madagascar' },
        { code: 'MW', name: 'Malawi' },
        { code: 'MY', name: 'Malaysia' },
        { code: 'MV', name: 'Maldives' },
        { code: 'ML', name: 'Mali' },
        { code: 'MT', name: 'Malta' },
        { code: 'MH', name: 'Marshall Islands' },
        { code: 'MQ', name: 'Martinique' },
        { code: 'MR', name: 'Mauritania' },
        { code: 'MU', name: 'Mauritius' },
        { code: 'YT', name: 'Mayotte' },
        { code: 'MX', name: 'Mexico' },
        { code: 'FM', name: 'Micronesia, Federated States of' },
        { code: 'MD', name: 'Moldova, Republic of' },
        { code: 'MC', name: 'Monaco' },
        { code: 'MN', name: 'Mongolia' },
        { code: 'ME', name: 'Montenegro' },
        { code: 'MS', name: 'Montserrat' },
        { code: 'MA', name: 'Morocco' },
        { code: 'MZ', name: 'Mozambique' },
        { code: 'MM', name: 'Myanmar' },
        { code: 'NA', name: 'Namibia' },
        { code: 'NR', name: 'Nauru' },
        { code: 'NP', name: 'Nepal' },
        { code: 'NL', name: 'Netherlands' },
        { code: 'NC', name: 'New Caledonia' },
        { code: 'NZ', name: 'New Zealand' },
        { code: 'NI', name: 'Nicaragua' },
        { code: 'NE', name: 'Niger' },
        { code: 'NG', name: 'Nigeria' },
        { code: 'NU', name: 'Niue' },
        { code: 'NF', name: 'Norfolk Island' },
        { code: 'MK', name: 'North Macedonia' },
        { code: 'MP', name: 'Northern Mariana Islands' },
        { code: 'NO', name: 'Norway' },
        { code: 'OM', name: 'Oman' },
        { code: 'PK', name: 'Pakistan' },
        { code: 'PW', name: 'Palau' },
        { code: 'PS', name: 'Palestine, State of' },
        { code: 'PA', name: 'Panama' },
        { code: 'PG', name: 'Papua New Guinea' },
        { code: 'PY', name: 'Paraguay' },
        { code: 'PE', name: 'Peru' },
        { code: 'PH', name: 'Philippines' },
        { code: 'PL', name: 'Poland' },
        { code: 'PT', name: 'Portugal' },
        { code: 'PR', name: 'Puerto Rico' },
        { code: 'QA', name: 'Qatar' },
        { code: 'RE', name: 'Réunion' },
        { code: 'RO', name: 'Romania' },
        { code: 'RU', name: 'Russian Federation' },
        { code: 'RW', name: 'Rwanda' },
        { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
        { code: 'KN', name: 'Saint Kitts and Nevis' },
        { code: 'LC', name: 'Saint Lucia' },
        { code: 'PM', name: 'Saint Pierre and Miquelon' },
        { code: 'VC', name: 'Saint Vincent and the Grenadines' },
        { code: 'WS', name: 'Samoa' },
        { code: 'SM', name: 'San Marino' },
        { code: 'ST', name: 'Sao Tome and Principe' },
        { code: 'SA', name: 'Saudi Arabia' },
        { code: 'SN', name: 'Senegal' },
        { code: 'RS', name: 'Serbia' },
        { code: 'SC', name: 'Seychelles' },
        { code: 'SL', name: 'Sierra Leone' },
        { code: 'SG', name: 'Singapore' },
        { code: 'SX', name: 'Sint Maarten (Dutch part)' },
        { code: 'SK', name: 'Slovakia' },
        { code: 'SI', name: 'Slovenia' },
        { code: 'SB', name: 'Solomon Islands' },
        { code: 'SO', name: 'Somalia' },
        { code: 'ZA', name: 'South Africa' },
        { code: 'SS', name: 'South Sudan' },
        { code: 'ES', name: 'Spain' },
        { code: 'LK', name: 'Sri Lanka' },
        { code: 'SD', name: 'Sudan' },
        { code: 'SR', name: 'Suriname' },
        { code: 'SE', name: 'Sweden' },
        { code: 'CH', name: 'Switzerland' },
        { code: 'SY', name: 'Syrian Arab Republic' },
        { code: 'TW', name: 'Taiwan' },
        { code: 'TJ', name: 'Tajikistan' },
        { code: 'TZ', name: 'Tanzania, United Republic of' },
        { code: 'TH', name: 'Thailand' },
        { code: 'TL', name: 'Timor-Leste' },
        { code: 'TG', name: 'Togo' },
        { code: 'TK', name: 'Tokelau' },
        { code: 'TO', name: 'Tonga' },
        { code: 'TT', name: 'Trinidad and Tobago' },
        { code: 'TN', name: 'Tunisia' },
        { code: 'TR', name: 'Turkey' },
        { code: 'TM', name: 'Turkmenistan' },
        { code: 'TC', name: 'Turks and Caicos Islands' },
        { code: 'TV', name: 'Tuvalu' },
        { code: 'UG', name: 'Uganda' },
        { code: 'UA', name: 'Ukraine' },
        { code: 'AE', name: 'United Arab Emirates' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'UM', name: 'United States Minor Outlying Islands' },
        { code: 'UY', name: 'Uruguay' },
        { code: 'UZ', name: 'Uzbekistan' },
        { code: 'VU', name: 'Vanuatu' },
        { code: 'VE', name: 'Venezuela' },
        { code: 'VN', name: 'Viet Nam' },
        { code: 'VG', name: 'Virgin Islands, British' },
        { code: 'VI', name: 'Virgin Islands, U.S.' },
        { code: 'WF', name: 'Wallis and Futuna' },
        { code: 'EH', name: 'Western Sahara' },
        { code: 'YE', name: 'Yemen' },
        { code: 'ZM', name: 'Zambia' },
        { code: 'ZW', name: 'Zimbabwe' }
    ];

    const canSubmit = !titleErrorMessage && !cityErrorMessage && !countryErrorMessage && !mapsUrlErrorMessage && title.trim() && city.trim() && country.trim();

    return (
        <Modal 
            visible={visible} 
            onClose={handleCancel}
            title="Add Location"
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

                {/* Country Field */}
                <div className="add-social-modal-content">
                    <label htmlFor="country" className="add-social-modal-label">
                        Country *
                    </label>
                    <select
                        id="country"
                        value={country}
                        onChange={handleCountryChange}
                        onBlur={handleCountryBlur}
                        className={`add-social-modal-input ${countryErrorMessage ? 'add-social-modal-input--error' : ''}`}
                    >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                            <option key={country.code} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
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
                        text="Add Location"
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

export default AddLocationModal;