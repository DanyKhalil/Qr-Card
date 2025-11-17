import React, { useState, useEffect, useRef } from "react";
import {  View, Text, TextInput, StyleSheet,  KeyboardAvoidingView,   Platform,   ScrollView } from "react-native";
import AppModal from "../Modal/Modal";
import Button from "../../../UserProfile/Button/Button";

const EditLocationModal = ({ locationObject, visible, onClose, setter }) => {
    const [title, setTitle] = useState(locationObject.title);
    const [floor, setFloor] = useState(locationObject.floor);
    const [building, setBuilding] = useState(locationObject.building);
    const [street, setStreet] = useState(locationObject.street);
    const [city, setCity] = useState(locationObject.city);
    const [state, setState] = useState(locationObject.state);
    const [country, setCountry] = useState(locationObject.country);
    const [mapsUrl, setMapsUrl] = useState(locationObject.maps_url);

    const titleRef = useRef(null);

    useEffect(() => {
        setTitle(locationObject.title);
        setFloor(locationObject.floor);
        setBuilding(locationObject.building);
        setStreet(locationObject.street);
        setCity(locationObject.city);
        setState(locationObject.state);
        setCountry(locationObject.country);
        setMapsUrl(locationObject.maps_url);
    }, [locationObject]);

    const resetFields = () => {
        setTitle("");
        setFloor("");
        setBuilding("");
        setStreet("");
        setCity("");
        setState("");
        setCountry("");
        setMapsUrl("");
    };

    const handleSubmit = () => {
        if (!title.trim() || !city.trim() || !country.trim()) return;

        setter((oldLoc) =>
            oldLoc.map((loc) =>
                loc.id === locationObject.id
                    ? {
                          ...loc,
                          title,
                          floor,
                          building,
                          street,
                          city,
                          state,
                          country,
                          maps_url: mapsUrl,
                      }
                    : loc
            )
        );

        resetFields();
        onClose();
    };

    const handleCancel = () => {
        resetFields();
        onClose();
    };

    return (
        <AppModal visible={visible} onClose={handleCancel} title="Edit Location">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    <View style={styles.content}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            ref={titleRef}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="My Office"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Floor</Text>
                        <TextInput
                            value={floor}
                            onChangeText={setFloor}
                            placeholder="Example: 3rd Floor"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Building</Text>
                        <TextInput
                            value={building}
                            onChangeText={setBuilding}
                            placeholder="Example: Tower A"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Street</Text>
                        <TextInput
                            value={street}
                            onChangeText={setStreet}
                            placeholder="123 Example Road"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            value={city}
                            onChangeText={setCity}
                            placeholder="San Francisco"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            value={state}
                            onChangeText={setState}
                            placeholder="California"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Country</Text>
                        <TextInput
                            value={country}
                            onChangeText={setCountry}
                            placeholder="United States"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Maps URL</Text>
                        <TextInput
                            value={mapsUrl}
                            onChangeText={setMapsUrl}
                            placeholder="https://maps.google.com/your-location"
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                        />
                    </View>

                    <View style={styles.actions}>
                        <Button
                            text="Save Changes"
                            color="green"
                            disabled={!title.trim() || !city.trim() || !country.trim()}
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
        color: "#333",
        marginBottom: 6,
    },
    input: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: "#e5e5e5",
        borderRadius: 10,
        fontSize: 16,
    },
    actions: {
        flexDirection: "column",
        gap: 12,
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#e5e5e5",
        paddingTop: 20,
    },
    actionBtn: {
        width: "100%",
    },
});

export default EditLocationModal;
