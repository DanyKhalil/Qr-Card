import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Text, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface CoverPhotoProps {
    photo?: string;
    height?: number;
    alt?: string;
    editable?: boolean;
    onEditPress?: () => void;
}

const CoverPhoto = ({
        photo = '',
        height = 300,
        alt = "Cover photo",
    }: CoverPhotoProps) => {

        // this is for when the photo is empty that means the user has no covre photo
        const renderDefaultCover = () => (
            <View style={[styles.defaultCover, { height }]}>
                <Ionicons name="image-outline" size={80} color="#adb5bd" />
                <View style={styles.defaultCoverLabel}>
                    <Ionicons name="camera" size={16} color="#6c757d" />
                    <Text style={styles.defaultCoverText}>No Cover Photo</Text>
                </View>
            </View>
        );

        return (
            <View style={[styles.container, { height }]}>
                <View style={styles.content}>
                    {photo ? (
                    <Image
                        source={{ uri: photo }}
                        style={[styles.image, { height }]}
                        resizeMode="cover"
                        accessibilityLabel={alt}
                    />
                    ) : (
                    renderDefaultCover()
                    )}
                </View>
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f9fa',
        overflow: 'hidden',
        position: 'relative',
    },
    content: {
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    defaultCover: {
        width: '100%',
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultCoverLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 6,
    },
    defaultCoverText: {
        color: '#6c757d',
        fontSize: 16,
        fontWeight: '500',
    },
    editButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    editButtonInner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CoverPhoto;