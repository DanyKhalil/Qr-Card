import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface CoverPhotoProps {
    photo?: string;
    height?: number;
    alt?: string;
    editable?: boolean;
    onEditPress?: () => void;
    onCoverChange?: () => void;
    onCoverRemove?: () => void;
}

const CoverPhoto = ({
    photo = '',
    height = 300,
    alt = "Cover photo",
    onCoverChange,
    onCoverRemove
}: CoverPhotoProps) => {

    // this is for when the photo is empty that means the user has no cover photo
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
            
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    onPress={onCoverChange}
                    style={[styles.button, styles.editButton]}
                >
                    <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
                {photo && (
                    <TouchableOpacity
                        onPress={onCoverRemove}
                        style={[styles.button, styles.removeButton]}
                    >
                        <Ionicons name="trash" size={20} color="white" />
                    </TouchableOpacity>
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
    buttonsContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
    editButton: {
        backgroundColor: '#4CAF50',
    },
    removeButton: {
        backgroundColor: '#FF6B6B',
    },
});

export default CoverPhoto;