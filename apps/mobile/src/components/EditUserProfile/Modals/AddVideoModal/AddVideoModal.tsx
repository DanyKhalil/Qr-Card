import React, { useState, useEffect, useRef } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    KeyboardAvoidingView, 
    Platform 
} from "react-native";
import AppModal from "../Modal/Modal";
import Button from "../../../UserProfile/Button/Button";

const AddVideoModal = ({ visible, onClose, setter }) => {
    const [videoUrl, setVideoUrl] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");

    const [videoUrlErrorMessage, setVideoUrlErrorMessage] = useState("");
    const [videoTitleErrorMessage, setVideoTitleErrorMessage] = useState("");
    const [videoUrlIsTouched, setVideoUrlIsTouched] = useState(false);
    const [videoTitleIsTouched, setVideoTitleIsTouched] = useState(false);

    const urlRef = useRef(null);

    const validateYouTubeUrl = (url) => {
        const trimmedUrl = url.trim();
        
        if (trimmedUrl === '') {
            return 'YouTube URL is required';
        }

        const youtubePatterns = [
            /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/, // Standard watch URL
            /^(https?:\/\/)?(www\.)?youtu\.be\/[a-zA-Z0-9_-]+/, // Short URL
            /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+/, // Embed URL
            /^(https?:\/\/)?(www\.)?youtube\.com\/v\/[a-zA-Z0-9_-]+/, // Legacy URL
            /^(https?:\/\/)?(www\.)?youtube\.com\/attribution_link\?.*v=[a-zA-Z0-9_-]+/, // Attribution links
        ];

        const isValidYouTubeUrl = youtubePatterns.some(pattern => pattern.test(trimmedUrl));
        
        if (!isValidYouTubeUrl) {
            return 'Please enter a valid YouTube URL (youtube.com, youtu.be)';
        }

        return '';
    };

    const validateVideoTitle = (title) => {
        const trimmedTitle = title.trim();
        
        if (trimmedTitle === '') {
            return 'Title is required';
        }
        if (trimmedTitle.length < 2) {
            return 'Title must be at least 2 characters long';
        }
        if (trimmedTitle.length > 100) {
            return 'Title must be less than 100 characters';
        }
        return '';
    };

    const handleVideoUrlChange = (value) => {
        setVideoUrl(value);
        if (videoUrlIsTouched) {
            setVideoUrlErrorMessage(validateYouTubeUrl(value));
        }
    };

    const handleVideoTitleChange = (value) => {
        setVideoTitle(value);
        if (videoTitleIsTouched) {
            setVideoTitleErrorMessage(validateVideoTitle(value));
        }
    };

    const handleVideoUrlBlur = () => {
        setVideoUrlIsTouched(true);
        setVideoUrlErrorMessage(validateYouTubeUrl(videoUrl));
    };

    const handleVideoTitleBlur = () => {
        setVideoTitleIsTouched(true);
        setVideoTitleErrorMessage(validateVideoTitle(videoTitle));
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                urlRef.current?.focus();
            }, 150);
        } else {
            setVideoUrl("");
            setVideoTitle("");
            setVideoDescription("");
            setVideoUrlErrorMessage("");
            setVideoTitleErrorMessage("");
            setVideoUrlIsTouched(false);
            setVideoTitleIsTouched(false);
        }
    }, [visible]);

    const generateId = () => 
        `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

    const handleSubmit = () => {
        setVideoUrlIsTouched(true);
        setVideoTitleIsTouched(true);
        
        const urlError = validateYouTubeUrl(videoUrl);
        const titleError = validateVideoTitle(videoTitle);
        
        setVideoUrlErrorMessage(urlError);
        setVideoTitleErrorMessage(titleError);

        if (urlError || titleError) {
            return;
        }

        if (videoUrl.trim() && videoTitle.trim()) {
            setter((oldVideos) => [
                ...oldVideos,
                {
                    id: generateId(),
                    video_url: videoUrl.trim(),
                    title: videoTitle.trim(),
                    description: videoDescription.trim(),
                }
            ]);
            
            setVideoUrl("");
            setVideoTitle("");
            setVideoDescription("");
            setVideoUrlErrorMessage("");
            setVideoTitleErrorMessage("");
            setVideoUrlIsTouched(false);
            setVideoTitleIsTouched(false);
            onClose();
        }
    };

    const handleCancel = () => {
        setVideoUrl("");
        setVideoTitle("");
        setVideoDescription("");
        setVideoUrlErrorMessage("");
        setVideoTitleErrorMessage("");
        setVideoUrlIsTouched(false);
        setVideoTitleIsTouched(false);
        onClose();
    };

    const canSubmit = !videoUrlErrorMessage && !videoTitleErrorMessage && videoUrl.trim() && videoTitle.trim();

    return (
        <AppModal visible={visible} onClose={handleCancel} title="Add Video">
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >

                <View style={styles.content}>
                    <Text style={styles.label}>YouTube URL *</Text>
                    <TextInput
                        ref={urlRef}
                        value={videoUrl}
                        onChangeText={handleVideoUrlChange}
                        onBlur={handleVideoUrlBlur}
                        placeholder="https://youtube.com/watch?v=..."
                        style={[
                            styles.input, 
                            videoUrlErrorMessage ? styles.inputError : null
                        ]}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                    />
                    <Text style={styles.errorText}>{videoUrlErrorMessage || ' '}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        value={videoTitle}
                        onChangeText={handleVideoTitleChange}
                        onBlur={handleVideoTitleBlur}
                        placeholder="My Video"
                        style={[
                            styles.input, 
                            videoTitleErrorMessage ? styles.inputError : null
                        ]}
                    />
                    <Text style={styles.errorText}>{videoTitleErrorMessage || ' '}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        value={videoDescription}
                        onChangeText={setVideoDescription}
                        placeholder="This video shows how..."
                        style={styles.input}
                        multiline
                    />
                </View>

                <View style={styles.actions}>
                    <Button
                        text="Add Video"
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
        color: "#2E2B5F", // Dark Indigo
        marginBottom: 6,
    },
    input: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: "#6C63FF", // Indigo border
        borderRadius: 10,
        fontSize: 16,
        color: "#2E2B5F", // Dark Indigo text
        backgroundColor: "#F5F4FF", // Light Lavender background
    },
    inputError: {
        borderColor: "#9A6CFF", // Soft Lavender error
    },
    errorText: {
        color: "#9A6CFF", // Soft Lavender error
        fontSize: 12,
        marginTop: 4,
        minHeight: 16,
    },
    actions: {
        flexDirection: "column",
        gap: 12,
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#DAD6FF", // Light Lavender divider
        paddingTop: 20,
    },
    actionBtn: {
        width: "100%",
    },
});


export default AddVideoModal;