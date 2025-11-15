import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface YouTubeObject {
    video_url: string;
    title?: string;
    description?: string;
}

interface YouTubePreviewProps {
    youtubeObject: YouTubeObject;
    width?: number | string;
    height?: number;
    autoPlay?: boolean;
}

const YouTubePreview = ({
    youtubeObject,
    width = '100%',
    height = 240,
    autoPlay = false,
}: YouTubePreviewProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const { width: screenWidth } = useWindowDimensions();

    const getVideoId = (youtubeObj: YouTubeObject) => {
        if (!youtubeObj || !youtubeObj.video_url) {
            return null;
        }
        
        const url = youtubeObj.video_url;
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(youtubeObject);

    if (!videoId || !youtubeObject) {
        return (
        <View style={[styles.errorContainer, { width, height }]}>
            <Ionicons name="alert-circle" size={32} color="#666" />
            <Text style={styles.errorText}>Invalid YouTube Video</Text>
        </View>
        );
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const handleThumbnailPress = () => {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        Linking.openURL(youtubeUrl).catch((err) => 
            console.error('Failed to open YouTube:', err)
        );
    };

    const handleOpenInYouTube = () => {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        Linking.openURL(youtubeUrl);
    };

    return (
        <View style={[styles.container, { width }]}>
            {youtubeObject.title && (
                <View style={styles.titleContainer}>
                <Text style={styles.title}>{youtubeObject.title}</Text>
                </View>
            )}

            <TouchableOpacity
                style={[styles.videoContainer, { height }]}
                onPress={handleThumbnailPress}
                activeOpacity={0.8}
            >
                <Image
                    source={{ uri: thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                />
                
                <View style={styles.overlay}>
                    <View style={styles.playButton}>
                        <Ionicons name="play" size={40} color="white" />
                    </View>
                </View>

                <View style={styles.youtubeBadge}>
                    <Ionicons name="logo-youtube" size={16} color="white" />
                    <Text style={styles.youtubeText}>YouTube</Text>
                </View>
            </TouchableOpacity>

            {youtubeObject.description && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{youtubeObject.description}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // marginVertical: 16,
    },
    titleContainer: {
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        lineHeight: 24,
    },
    videoContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    youtubeBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    youtubeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    descriptionContainer: {
        marginTop: 12,
        paddingHorizontal: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    openButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0000',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    openButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    errorText: {
        marginTop: 8,
        color: '#666',
        fontSize: 16,
    },
});

export default YouTubePreview;