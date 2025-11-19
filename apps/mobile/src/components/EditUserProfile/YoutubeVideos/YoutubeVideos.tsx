import React from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import YouTubeCard from "../YoutubeCard/YoutubeCard";
import Button from "../../UserProfile/Button/Button";

const YoutubeVideos = ({
    videos = [],
    setter,
    gap = 16,
    className = "",
    addAction,
    updateAction,
    objectSetter,
}) => {
    const { width } = useWindowDimensions();

    if (!videos || videos.length === 0) return null;

    return (
        <View style={[styles.section, className && { marginVertical: 8 }]}>
            <Text style={styles.title}>Videos</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.videosRow, { gap }]}
            >
                {videos.map((videoData, index) => (
                    <View key={index} style={styles.videoItem}>
                        <YouTubeCard
                            id={videoData.id}
                            title={videoData.title}
                            description={videoData.description}
                            url={videoData.video_url}
                            setter={setter}
                            updateAction={updateAction}
                            objectSetter={objectSetter}
                        />
                    </View>
                ))}
            </ScrollView>

            <Button
                text="Add Video Link"
                color="green"
                width="100%"
                onPress={addAction}
                style={{ marginTop: 16 }}
            />
        </View>
    );
};

export default YoutubeVideos;

const styles = StyleSheet.create({
    section: {
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",
        paddingVertical: 20,
        paddingHorizontal: 20,
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 16,
        color: "#333",
    },

    videosRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingBottom: 8,
    },

    videoItem: {
        width: 350,
        borderRadius: 12,
        overflow: "hidden",
    },
});
