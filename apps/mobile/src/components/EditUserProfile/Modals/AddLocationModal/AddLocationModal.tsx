import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import AppModal from "../Modal/Modal";
import Button from "../../../UserProfile/Button/Button";

const AddLocationModal = ({ visible, onClose, setter }) => {
    const [title, setTitle] = useState("");
    const [floor, setFloor] = useState("");
    const [building, setBuilding] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [mapsUrl, setMapsUrl] = useState("");

    const [titleErrorMessage, setTitleErrorMessage] = useState("");
    const [floorErrorMessage, setFloorErrorMessage] = useState("");
    const [buildingErrorMessage, setBuildingErrorMessage] = useState("");
    const [streetErrorMessage, setStreetErrorMessage] = useState("");
    const [cityErrorMessage, setCityErrorMessage] = useState("");
    const [stateErrorMessage, setStateErrorMessage] = useState("");
    const [countryErrorMessage, setCountryErrorMessage] = useState("");
    const [mapsUrlErrorMessage, setMapsUrlErrorMessage] = useState("");

    const [titleIsTouched, setTitleIsTouched] = useState(false);
    const [floorIsTouched, setFloorIsTouched] = useState(false);
    const [buildingIsTouched, setBuildingIsTouched] = useState(false);
    const [streetIsTouched, setStreetIsTouched] = useState(false);
    const [cityIsTouched, setCityIsTouched] = useState(false);
    const [stateIsTouched, setStateIsTouched] = useState(false);
    const [countryIsTouched, setCountryIsTouched] = useState(false);
    const [mapsUrlIsTouched, setMapsUrlIsTouched] = useState(false);

    const titleRef = useRef(null);

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                titleRef.current?.focus();
            }, 150);
        } else {
            resetFields();
        }
    }, [visible]);

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
        
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?$/;
        if (!urlPattern.test(trimmedValue)) {
            return 'Please enter a valid URL';
        }

        const mapsPatterns = [
            /maps\.google/,
            /google\.com\/maps/,
            /goo\.gl\/maps/,
            /maps\.app\.goo\.gl/,
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

    const handleTitleChange = (value) => {
        setTitle(value);
        if (titleIsTouched) {
            setTitleErrorMessage(validateTitle(value));
        }
    };

    const handleFloorChange = (value) => {
        setFloor(value);
        if (floorIsTouched) {
            setFloorErrorMessage(validateFloor(value));
        }
    };

    const handleBuildingChange = (value) => {
        setBuilding(value);
        if (buildingIsTouched) {
            setBuildingErrorMessage(validateBuilding(value));
        }
    };

    const handleStreetChange = (value) => {
        setStreet(value);
        if (streetIsTouched) {
            setStreetErrorMessage(validateStreet(value));
        }
    };

    const handleCityChange = (value) => {
        setCity(value);
        if (cityIsTouched) {
            setCityErrorMessage(validateCity(value));
        }
    };

    const handleStateChange = (value) => {
        setState(value);
        if (stateIsTouched) {
            setStateErrorMessage(validateState(value));
        }
    };

    const handleCountryChange = (value) => {
        setCountry(value);
        if (countryIsTouched) {
            setCountryErrorMessage(validateCountry(value));
        }
    };

    const handleMapsUrlChange = (value) => {
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

    const resetFields = () => {
        setTitle("");
        setFloor("");
        setBuilding("");
        setStreet("");
        setCity("");
        setState("");
        setCountry("");
        setMapsUrl("");
        
        setTitleErrorMessage("");
        setFloorErrorMessage("");
        setBuildingErrorMessage("");
        setStreetErrorMessage("");
        setCityErrorMessage("");
        setStateErrorMessage("");
        setCountryErrorMessage("");
        setMapsUrlErrorMessage("");
        
        setTitleIsTouched(false);
        setFloorIsTouched(false);
        setBuildingIsTouched(false);
        setStreetIsTouched(false);
        setCityIsTouched(false);
        setStateIsTouched(false);
        setCountryIsTouched(false);
        setMapsUrlIsTouched(false);
    };

    const generateId = () =>
        `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

    const handleSubmit = () => {
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
            setter((oldLocations) => [
                ...oldLocations,
                {
                    id: generateId(),
                    title: title.trim(),
                    floor: floor.trim(),
                    building: building.trim(),
                    street: street.trim(),
                    city: city.trim(),
                    state: state.trim(),
                    country: country,
                    maps_url: mapsUrl.trim(),
                },
            ]);

            resetFields();
            onClose();
        }
    };

    const handleCancel = () => {
        resetFields();
        onClose();
    };

    const canSubmit = !titleErrorMessage && !cityErrorMessage && !countryErrorMessage && !mapsUrlErrorMessage && title.trim() && city.trim() && country.trim();

    return (
        <AppModal visible={visible} onClose={handleCancel} title="Add Location">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    <View style={styles.content}>
                        <Text style={styles.label}>Title *</Text>
                        <TextInput
                            ref={titleRef}
                            value={title}
                            onChangeText={handleTitleChange}
                            onBlur={handleTitleBlur}
                            placeholder="My Office"
                            style={[styles.input, titleErrorMessage ? styles.inputError : null]}
                        />
                        <Text style={styles.errorText}>{titleErrorMessage || ' '}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Floor</Text>
                        <TextInput
                            value={floor}
                            onChangeText={handleFloorChange}
                            onBlur={handleFloorBlur}
                            placeholder="Example: 3rd Floor"
                            style={[styles.input, floorErrorMessage ? styles.inputError : null]}
                        />
                        <Text style={styles.errorText}>{floorErrorMessage || ' '}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Building</Text>
                        <TextInput
                            value={building}
                            onChangeText={handleBuildingChange}
                            onBlur={handleBuildingBlur}
                            placeholder="Example: Tower A"
                            style={[styles.input, buildingErrorMessage ? styles.inputError : null]}
                        />
                        <Text style={styles.errorText}>{buildingErrorMessage || ' '}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Street</Text>
                        <TextInput
                            value={street}
                            onChangeText={handleStreetChange}
                            onBlur={handleStreetBlur}
                            placeholder="123 Example Road"
                            style={[styles.input, streetErrorMessage ? styles.inputError : null]}
                        />
                        <Text style={styles.errorText}>{streetErrorMessage || ' '}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>City *</Text>
                        <TextInput
                            value={city}
                            onChangeText={handleCityChange}
                            onBlur={handleCityBlur}
                            placeholder="San Francisco"
                            style={[styles.input, cityErrorMessage ? styles.inputError : null]}
                        />
                        <Text style={styles.errorText}>{cityErrorMessage || ' '}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            value={state}
                            onChangeText={handleStateChange}
                            onBlur={handleStateBlur}
                            placeholder="California"
                            style={[styles.input, stateErrorMessage ? styles.inputError : null]}
                        />
                        <Text style={styles.errorText}>{stateErrorMessage || ' '}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Country *</Text>
                        <TextInput
                            value={country}
                            onChangeText={handleCountryChange}
                            onBlur={handleCountryBlur}
                            placeholder="United States"
                            style={[styles.input, countryErrorMessage ? styles.inputError : null]}
                        />
                        <Text style={styles.errorText}>{countryErrorMessage || ' '}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Maps URL</Text>
                        <TextInput
                            value={mapsUrl}
                            onChangeText={handleMapsUrlChange}
                            onBlur={handleMapsUrlBlur}
                            placeholder="https://maps.google.com/your-location"
                            style={[styles.input, mapsUrlErrorMessage ? styles.inputError : null]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                        />
                        <Text style={styles.errorText}>{mapsUrlErrorMessage || ' '}</Text>
                    </View>

                    <View style={styles.actions}>
                        <Button
                            text="Add Location"
                            color="green"
                            disabled={!canSubmit}
                            onPress={handleSubmit}
                            style={styles.actionBtn}
                        />

                        <Button
                            text="Cancel"
                            color="coral"
                            onPress={handleCancel}
                            style={styles.actionBtn}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppModal>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingBottom: 10,
    },
    label: {
        fontSize: 15,
        fontWeight: "500",
        color: "#2E2B5F", // dark indigo
        marginBottom: 6,
    },
    input: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: "#6C63FF", // indigo border
        borderRadius: 10,
        fontSize: 16,
        color: "#2E2B5F", // dark indigo text
        backgroundColor: "#F5F4FF", // light lavender background
    },
    inputError: {
        borderColor: "#9A6CFF", // soft lavender-red for errors
    },
    errorText: {
        color: "#9A6CFF", // soft lavender-red
        fontSize: 12,
        marginTop: 4,
        minHeight: 16,
    },
    actions: {
        flexDirection: "column",
        gap: 12,
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#DAD6FF", // light lavender divider
        paddingTop: 20,
    },
    actionBtn: {
        width: "100%",
    },
});


export default AddLocationModal;