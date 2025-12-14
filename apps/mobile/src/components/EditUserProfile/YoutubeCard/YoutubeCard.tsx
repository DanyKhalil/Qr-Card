import React from "react";
import { View, Text, StyleSheet, Alert, useWindowDimensions, ScrollView } from "react-native";
import Button from "../../UserProfile/Button/Button";

const YouTubeCard = ({
    id,
    title = "",
    description = "",
    url = "",
    setter,
    className = "",
    updateAction,
    objectSetter,
}) => {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;

    const videoObject = { id, title, description, video_url: url };

    const handleDeleteVideo = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to remove this video?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () =>
                        setter((old) => old.filter((video) => video.id !== id)),
                },
            ]
        );
    };

    const renderField = (label, value, multiLine = false) => {
        if (!value) return null;
        return (
            <View style={styles.field}>
                <Text style={[styles.label, isSmallScreen && styles.smallLabel]}>{label}:</Text>
                <View style={[styles.textField, multiLine && styles.multiLineField]}>
                    {multiLine ? (
                        <ScrollView 
                            style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={styles.text}>{value}</Text>
                        </ScrollView>
                    ) : (
                        <Text style={styles.text} numberOfLines={2}>{value}</Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.card, className && { marginVertical: 6 }]}>
            <View style={styles.content}>
                {renderField("Title", title)}
                {renderField("Description", description, true)}
                {renderField("URL", url)}

                <View style={[styles.buttons, isSmallScreen && styles.buttonsMobile]}>
                    <Button
                        text="Edit"
                        color="green"
                        width={isSmallScreen ? "100%" : "100px"}
                        onPress={() => {
                            updateAction();
                            objectSetter(videoObject);
                        }}
                    />
                    <Button
                        text="Remove"
                        color="coral"
                        width={isSmallScreen ? "100%" : "100px"}
                        onPress={handleDeleteVideo}
                    />
                </View>
            </View>
        </View>
    );
};

export default YouTubeCard;

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#547DAD', // Primary Indigo Blue
        borderRadius: 12,
        padding: 20,
        backgroundColor: '#ffffff',
        width: "100%",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    content: {
        flexDirection: "column",
        gap: 16,
    },
    field: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    label: {
        width: 100,
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
        marginRight: 12,
        paddingTop: 12,
        lineHeight: 20,
    },
    smallLabel: {
        width: 80,
        fontSize: 13,
    },
    textField: {
        flex: 1,
        padding: 12,
        backgroundColor: '#E3E0F3', // Soft Lavender
        borderWidth: 1,
        borderColor: '#547DAD', // Primary Indigo Blue
        borderRadius: 8,
        minHeight: 44,
        justifyContent: "center",
    },
    multiLineField: {
        minHeight: 60,
        justifyContent: "flex-start",
    },
    scrollView: {
        flex: 1,
    },
    text: {
        fontSize: 15,
        color: "#333",
        lineHeight: 20,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#547DAD', // Primary Indigo Blue
    },
    buttonsMobile: {
        flexDirection: "column",
        justifyContent: "center",
        gap: 8,
    },
});
