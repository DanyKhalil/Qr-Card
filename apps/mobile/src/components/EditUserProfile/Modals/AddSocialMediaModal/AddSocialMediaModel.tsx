import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import AppModal from "../Modal/Modal";
import Button from "../../../UserProfile/Button/Button";

const AddSocialMediaModal = ({ visible, onClose, setter }) => {
    const [socialMediaLink, setSocialMediaLink] = useState("");
    const [socialMediaLinkErrorMessage, setSocialMediaLinkErrorMessage] = useState("");
    const [isTouched, setIsTouched] = useState(false);

    const inputRef = useRef(null);

    const socialMediaPatterns = {
        whatsapp: /^(https?:\/\/)?(www\.)?(wa\.me\/|whatsapp\.com\/)/,
        facebook: /^(https?:\/\/)?(www\.)?(facebook\.com\/|fb\.com\/)/,
        instagram: /^(https?:\/\/)?(www\.)?instagram\.com\//,
        tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\//,
        youtube: /^(https?:\/\/)?(www\.)?(youtube\.com\/|youtu\.be\/)/,
        x: /^(https?:\/\/)?(www\.)?x\.com\//,
        twitter: /^(https?:\/\/)?(www\.)?(twitter\.com\/|x\.com\/)/,
        linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\//,
        github: /^(https?:\/\/)?(www\.)?github\.com\//
    };

    const validateSocialMediaLink = (url) => {
        const trimmedUrl = url.trim();
        
        if (trimmedUrl === '') {
            return 'Please enter a social media link';
        }

        const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?$/;
        if (!urlPattern.test(trimmedUrl)) {
            return 'Please enter a valid URL';
        }

        const isSupportedPlatform = Object.values(socialMediaPatterns).some(pattern => 
            pattern.test(trimmedUrl)
        );

        if (!isSupportedPlatform) {
            const supportedPlatforms = Object.keys(socialMediaPatterns).join(', ');
            return `Please enter a supported social media link (${supportedPlatforms})`;
        }

        return '';
    };

    const handleInputChange = (value) => {
        setSocialMediaLink(value);
        
        if (isTouched) {
            const error = validateSocialMediaLink(value);
            setSocialMediaLinkErrorMessage(error);
        }
    };

    const handleInputBlur = () => {
        setIsTouched(true);
        const error = validateSocialMediaLink(socialMediaLink);
        setSocialMediaLinkErrorMessage(error);
    };

    const detectPlatform = (url) => {
        for (const [platform, pattern] of Object.entries(socialMediaPatterns)) {
            if (pattern.test(url)) {
                return platform;
            }
        }
        return null;
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 150);
        } else {
            setSocialMediaLink("");
            setSocialMediaLinkErrorMessage("");
            setIsTouched(false);
        }
    }, [visible]);

    const handleSubmit = () => {
        setIsTouched(true);
        
        const error = validateSocialMediaLink(socialMediaLink);
        if (error) {
            setSocialMediaLinkErrorMessage(error);
            return;
        }

        if (socialMediaLink.trim()) {
            setter((oldLinks) => [
                ...oldLinks,
                {
                    id: `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
                    url: socialMediaLink.trim()
                },
            ]);
            setSocialMediaLink("");
            setSocialMediaLinkErrorMessage("");
            setIsTouched(false);
            onClose();
        }
    };

    const handleCancel = () => {
        setSocialMediaLink("");
        setSocialMediaLinkErrorMessage("");
        setIsTouched(false);
        onClose();
    };

    const currentPlatform = detectPlatform(socialMediaLink);

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
                        onChangeText={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="https://instagram.com/yourusername"
                        style={[
                            styles.input, 
                            socialMediaLinkErrorMessage ? styles.inputError : null
                        ]}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                    />
                    
                    <Text style={styles.errorText}>
                        {socialMediaLinkErrorMessage || 
                         (currentPlatform && !socialMediaLinkErrorMessage 
                            ? `✓ ${currentPlatform.charAt(0).toUpperCase() + currentPlatform.slice(1)} link detected`
                            : ' ')}
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        text="Add Link"
                        color="green"
                        disabled={!socialMediaLink.trim() || !!socialMediaLinkErrorMessage}
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
    inputError: {
        borderColor: "#ff4444",
    },
    errorText: {
        color: "#ff4444",
        fontSize: 12,
        marginTop: 4,
        minHeight: 16,
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