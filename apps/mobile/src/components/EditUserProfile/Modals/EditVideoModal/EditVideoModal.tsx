import React, { useState, useEffect, useRef } from "react";
import {  View, Text,  TextInput,  StyleSheet, KeyboardAvoidingView,  Platform,  ScrollView} from "react-native";
import AppModal from "../Modal/Modal";
import Button from "../../../UserProfile/Button/Button";

const EditVideoModal = ({ videoObject, visible, onClose, setter }) => {
    const [videoUrl, setVideoUrl] = useState(videoObject.video_url);
    const [videoTitle, setVideoTitle] = useState(videoObject.title);
    const [videoDescription, setVideoDescription] = useState(videoObject.description);

    const urlRef = useRef(null);

    useEffect(() => {
        setVideoUrl(videoObject.video_url);
        setVideoTitle(videoObject.title);
        setVideoDescription(videoObject.description);
    }, [videoObject]);

    const handleSubmit = () => {
        if (!videoUrl.trim() || !videoTitle.trim()) return;

        setter((oldVideos) =>
            oldVideos.map((vid) =>
                vid.id === videoObject.id
                    ? {
                          ...vid,
                          video_url: videoUrl.trim(),
                          title: videoTitle.trim(),
                          description: videoDescription.trim(),
                      }
                    : vid
            )
        );

        setVideoUrl("");
        setVideoTitle("");
        setVideoDescription("");
        onClose();
    };

    const handleCancel = () => {
        setVideoUrl("");
        setVideoTitle("");
        setVideoDescription("");
        onClose();
    };

    return (
        <AppModal visible={visible} onClose={handleCancel} title="Edit Video">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    {/* Video URL */}
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
                            text="Save"
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

export default EditVideoModal;
