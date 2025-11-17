import React, { useState, useEffect, useRef } from "react";
import {  View,  Text,  TextInput,  StyleSheet,  KeyboardAvoidingView,  Platform } from "react-native";
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

    const generateId = () =>
        `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

    const handleSubmit = () => {
        if (!title.trim() || !city.trim() || !country.trim()) return;

        setter((oldLocations) => [
            ...oldLocations,
            {
                id: generateId(),
                title,
                floor,
                building,
                street,
                city,
                state,
                country,
                maps_url: mapsUrl,
            },
        ]);

        resetFields();
        onClose();
    };

    const handleCancel = () => {
        resetFields();
        onClose();
    };

    return (
        <AppModal visible={visible} onClose={handleCancel} title="Add Location">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
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
                        placeholder="Example: 123 Example Road"
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

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        text="Add Location"
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

export default AddLocationModal;
