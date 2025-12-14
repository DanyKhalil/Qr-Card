import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, Modal, TouchableWithoutFeedback, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width: screenWidth } = Dimensions.get('window');

interface ProfilePicProps {
    photo?: string;
    alt?: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'default';
    onPress?: () => void;
}

const ProfilePic = ({
    photo,
    alt = "User profile",
    size = 'default',
    onPress,
}: ProfilePicProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const scaleAnim = new Animated.Value(0);

    const handleLongPress = () => {
        setIsModalVisible(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setIsModalVisible(false));
    };

    const getSize = () => {
        switch (size) {
            case 'small': return 40;
            case 'medium': return 60;
            case 'large': return 80;
            case 'xlarge': return 100;
            case 'xxlarge': return 150;
            default: return 210;
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'small': return 20;
            case 'medium': return 30;
            case 'large': return 40;
            case 'xlarge': return 50;
            case 'xxlarge': return 80;
            default: return 80;
        }
    };

    const getBorderWidth = () => {
        switch (size) {
            case 'small': return 2;
            case 'medium': return 3;
            case 'large': return 3;
            case 'xlarge': return 4;
            default: return 3;
        }
    };

    const getMarginTop = () => {
        switch (size) {
            case 'small': return -10;
            case 'medium': return -20;
            case 'large': return -30;
            case 'xlarge': return -40;
            case 'xxlarge': return -50;
            default: return -80;
        }
    };

    const renderDefaultIcon = () => (
        <View style={styles.defaultIcon}>
            <Ionicons name="person" size={getIconSize()} color="#9C8DFF" />
        </View>
    );

    const containerSize = getSize();
    const borderWidth = getBorderWidth();
    const innerSize = containerSize - borderWidth * 2;
    const marginTop = getMarginTop();

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.container,
                    {
                        width: containerSize,
                        height: containerSize,
                        borderWidth,
                        marginTop,
                    },
                ]}
                onPress={onPress}
                onLongPress={handleLongPress}
                activeOpacity={0.8}
                delayLongPress={300}
            >
                <View
                    style={[
                        styles.innerCircle,
                        { width: innerSize, height: innerSize, borderRadius: innerSize / 2 },
                    ]}
                >
                    {photo ? (
                        <Image
                            source={{ uri: photo }}
                            style={[styles.profileImage, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}
                            resizeMode="cover"
                            accessibilityLabel={alt}
                        />
                    ) : (
                        renderDefaultIcon()
                    )}
                </View>
            </TouchableOpacity>

            <Modal visible={isModalVisible} transparent animationType="none" statusBarTranslucent>
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}>
                        <BlurView intensity={80} style={StyleSheet.absoluteFill} />

                        <Animated.View
                            style={[
                                styles.enlargedContainer,
                                {
                                    transform: [
                                        {
                                            scale: scaleAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            {photo ? (
                                <Image source={{ uri: photo }} style={styles.enlargedImage} resizeMode="contain" />
                            ) : (
                                <View style={styles.enlargedDefault}>
                                    <Ionicons name="person" size={120} color="#9C8DFF" />
                                </View>
                            )}
                        </Animated.View>

                        <View style={styles.closeHint}>
                            <Ionicons name="close-circle" size={24} color="white" />
                            <Text style={styles.closeText}>Tap anywhere to close</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 1000,
        borderColor: '#9C8DFF',
        backgroundColor: '#E6E0FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    innerCircle: {
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {},
    defaultIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    enlargedContainer: {
        width: screenWidth * 0.9,
        height: screenWidth * 0.9,
        maxWidth: 400,
        maxHeight: 400,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    enlargedImage: {
        width: '100%',
        height: '100%',
    },
    enlargedDefault: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
    },
    closeHint: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    closeText: {
        color: 'white',
        marginTop: 8,
        fontSize: 14,
        opacity: 0.8,
    },
});

export default ProfilePic;
