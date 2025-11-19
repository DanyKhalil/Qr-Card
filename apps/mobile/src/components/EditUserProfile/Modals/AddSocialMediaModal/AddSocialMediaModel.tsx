import React, { useState, useEffect, useRef } from "react";
import {  View,  Text,  TextInput,  StyleSheet,  KeyboardAvoidingView,  Platform } from "react-native";
import AppModal from "../Modal/Modal";
import Button from "../../../UserProfile/Button/Button";

const AddSocialMediaModal = ({ visible, onClose, setter }) => {
    const [socialMediaLink, setSocialMediaLink] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 150);
        } else {
            setSocialMediaLink("");
        }
    }, [visible]);

    const handleSubmit = () => {
        if (socialMediaLink.trim()) {
            setter((oldLinks) => [
                ...oldLinks,
                {
                    id: `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
                    url: socialMediaLink,
                },
            ]);
            setSocialMediaLink("");
            onClose();
        }
    };

    const handleCancel = () => {
        setSocialMediaLink("");
        onClose();
    };

    return (
        <AppModal visible={visible} onClose={handleCancel} title="Add Social Media Link">
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.content}>
                    <Text style={styles.label}>Social Media Link</Text>

                    <TextInput
                        ref={inputRef}
                        value={socialMediaLink}
                        onChangeText={setSocialMediaLink}
                        placeholder="https://example.com/your-profile"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                    />
                </View>

                <View style={styles.actions}>
                    <Button
                        text="Add Link"
                        color="green"
                        disabled={!socialMediaLink.trim()}
                        onPress={handleSubmit}
                        style={styles.actionBtn}
                    />

                    <Button
                        text="Cancel"
                        color="coral"
                        onnPress={handleCancel}
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

export default AddSocialMediaModal;
