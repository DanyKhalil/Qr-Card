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
    className?: string;
    onProfileChange?: () => void;
    onProfileRemove?: () => void;
}

const ProfilePic = ({
    photo,
    alt = "User profile",
    size = 'default',
    onPress,
    className = "",
    onProfileChange,
    onProfileRemove
}: ProfilePicProps) => {

    // this is for profile pic animation when holded
    const [isModalVisible, setIsModalVisible] = useState(false);
    const scaleAnim = new Animated.Value(0);
  
    // this is for when the user hasnt profile oicture
    const renderDefaultIcon = () => (
        <View style={styles.defaultIcon}>
            <Ionicons name="person" size={getIconSize(size)} color="#999999" />
        </View>
    );

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

    const getIconSize = (sizeType: string) => {
        switch (sizeType) {
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

    const getButtonSize = () => {
        switch (size) {
            case 'small': return 20;
            case 'medium': return 25;
            case 'large': return 30;
            case 'xlarge': return 35;
            case 'xxlarge': return 40;
            default: return 40;
        }
    };

    const getButtonGap = () => {
        switch (size) {
            case 'small': return 4;
            case 'medium': return 6;
            case 'large': return 8;
            case 'xlarge': return 10;
            case 'xxlarge': return 12;
            default: return 12;
        }
    };


    //and this is some naimation and functionality for when the usr holds th eprofile pic
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
        }).start(() => {
            setIsModalVisible(false);
        });
    };

    const containerSize = getSize();
    const borderWidth = getBorderWidth();
    const innerSize = containerSize - (borderWidth * 2);
    const marginTop = getMarginTop();
    const buttonSize = getButtonSize();
    const buttonGap = getButtonGap();

    const ContainerComponent = TouchableOpacity;
    
    // Calculate total width of buttons container
    const buttonsContainerWidth = (buttonSize * 2) + buttonGap;

    return (
        <>
            <View style={styles.outerContainer}>
                <ContainerComponent
                    style={[
                        styles.container,
                        {
                            width: containerSize,
                            height: containerSize,
                            borderWidth: borderWidth,
                            marginTop: marginTop,
                            marginLeft: 0,
                        },
                    ]}
                    onPress={onPress}
                    onLongPress={handleLongPress}
                    activeOpacity={0.8}
                    delayLongPress={300}
                >
                    <View style={[
                        styles.innerCircle,
                        { 
                            width: innerSize, 
                            height: innerSize,
                            borderRadius: innerSize / 2,
                        }
                    ]}>
                        {photo ? (
                            <Image
                                source={{ uri: photo }}
                                style={[
                                styles.profileImage,
                                { 
                                    width: innerSize, 
                                    height: innerSize,
                                    borderRadius: innerSize / 2,
                                }
                                ]}
                                resizeMode="cover"
                                accessibilityLabel={alt}
                            />
                        ) : (
                        renderDefaultIcon()
                        )}
                    </View>
                </ContainerComponent>
                
                <View style={[
                    styles.buttonsContainer,
                    { 
                        top: 80, 
                        width: buttonsContainerWidth,
                        left: (containerSize - buttonsContainerWidth) / 2,
                        gap: 20,
                    }
                ]}>
                    <TouchableOpacity
                        onPress={onProfileChange}
                        style={[styles.button, styles.editButton, { width: buttonSize, height: buttonSize }]}
                    >
                        <Ionicons name="pencil" size={buttonSize * 0.5} color="white" />
                    </TouchableOpacity>
                    {photo && ( 
                        <TouchableOpacity
                            onPress={onProfileRemove}
                            style={[styles.button, styles.removeButton, { width: buttonSize, height: buttonSize }]}
                        >
                            <Ionicons name="trash" size={buttonSize * 0.5} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="none"
                statusBarTranslucent={true}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}>
                        <BlurView intensity={80} style={StyleSheet.absoluteFill} />
                        
                        <Animated.View 
                            style={[
                                styles.enlargedContainer,
                                {
                                    transform: [{
                                        scale: scaleAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.8, 1]
                                        })
                                    }]
                                }
                            ]}
                        >
                            {photo ? (
                                <Image
                                    source={{ uri: photo }}
                                    style={styles.enlargedImage}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={styles.enlargedDefault}>
                                    <Ionicons name="person" size={120} color="#999999" />
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
    outerContainer: {
        position: 'relative',
        alignSelf: 'flex-start',
    },
    container: {
        borderRadius: 1000,
        borderColor: '#82C294',
        backgroundColor: '#82C294',
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
    
    buttonsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    editButton: {
        backgroundColor: '#4CAF50',
    },
    removeButton: {
        backgroundColor: '#FF6B6B',
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