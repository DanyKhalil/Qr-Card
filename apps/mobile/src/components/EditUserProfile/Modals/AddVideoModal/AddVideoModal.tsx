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

    const urlRef = useRef(null);

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                urlRef.current?.focus();
            }, 150);
        } else {
            setVideoUrl("");
            setVideoTitle("");
            setVideoDescription("");
        }
    }, [visible]);

    const generateId = () => 
        `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

    const handleSubmit = () => {
        if (videoUrl.trim() && videoTitle.trim()) {
            setter((oldVideos) => [
                ...oldVideos,
                {
                    id: generateId(),
                    video_url: videoUrl,
                    title: videoTitle,
                    description: videoDescription,
                }
            ]);
            
            setVideoUrl("");
            setVideoTitle("");
            setVideoDescription("");
            onClose();
        }
    };

    const handleCancel = () => {
        setVideoUrl("");
        setVideoTitle("");
        setVideoDescription("");
        onClose();
    };

    return (
        <AppModal visible={visible} onClose={handleCancel} title="Add Video">
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >

                <View style={styles.content}>
                    <Text style={styles.label}>Video URL</Text>
                    <TextInput
                        ref={urlRef}
                        value={videoUrl}
                        onChangeText={setVideoUrl}
                        placeholder="https://youtube.com/your-video"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                    />
                </View>

                <View style={styles.content}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        value={videoTitle}
                        onChangeText={setVideoTitle}
                        placeholder="My Video"
                        style={styles.input}
                    />
                </View>

                {/* Description */}
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

                {/* Buttons */}
                <View style={styles.actions}>
                    <Button
                        text="Add Video"
                        color="green"
                        disabled={!videoUrl.trim() || !videoTitle.trim()}
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

export default AddVideoModal;
