import React, { useRef, useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    useWindowDimensions, 
    Alert, 
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    Linking
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Button from '../Button/Button';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { getExpoDeepLink } from '../../../config/development';
import Modal from 'react-native-modal';
import IconWithName from '../IconWithName/IconWithName';

interface ProfileQrCodeProps {
    id: string;
    color?: string;
    name?: string;
    userLinks?: Array<{
        name: string;
        iconName: string;
        link: string;
    }>;
    image?: string;
}

const ProfileQrCode = ({ 
    id, 
    color = "#000000", 
    name = "",
    userLinks = [],
    image 
}: ProfileQrCodeProps) => {
    const expoUrl = getExpoDeepLink(`/(stack)/user-profile/${id}`);
    const { width: screenWidth } = useWindowDimensions();
    const qrRef = useRef<View>(null);
    const [showStyleModal, setShowStyleModal] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('classic');
    const [permissionGranted, setPermissionGranted] = useState(false);

    if (!expoUrl) return null;

    const qrSize = screenWidth * 0.5;

    // Request permissions on mount
    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS === 'ios') {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setPermissionGranted(status === 'granted');
        } else {
            setPermissionGranted(true);
        }
    };

    // Style configurations - Simplified fonts for React Native
    const styleConfigs = {
        classic: {
            containerStyle: {
                borderWidth: 2,
                borderColor: color,
                backgroundColor: '#ffffff',
            },
            profileImageSize: 80,
            nameFontSize: 22,
            qrBorderWidth: 1,
            qrBackgroundColor: '#f8f8f8',
            nameFontWeight: '700' as const,
            nameLetterSpacing: 0.5,
            containerPadding: 20,
        },
        modern: {
            containerStyle: {
                borderWidth: 3,
                borderColor: '#333333',
                backgroundColor: '#f9f9f9',
            },
            profileImageSize: 90,
            nameFontSize: 24,
            qrBorderWidth: 0,
            qrBackgroundColor: '#ffffff',
            nameFontWeight: '600' as const,
            nameLetterSpacing: 1,
            containerPadding: 25,
        },
        elegant: {
            containerStyle: {
                borderWidth: 1,
                borderColor: '#555555',
                backgroundColor: '#ffffff',
            },
            profileImageSize: 70,
            nameFontSize: 20,
            qrBorderWidth: 2,
            qrBackgroundColor: '#f5f5f5',
            nameFontWeight: '500' as const,
            nameLetterSpacing: 0.8,
            nameTextTransform: 'uppercase' as const,
            containerPadding: 18,
        }
    };

    const currentStyle = styleConfigs[selectedStyle];

    const handleDownload = async () => {
        try {
            if (!permissionGranted && Platform.OS === 'ios') {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permission required',
                        'Please allow access to save the QR code.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Settings', onPress: () => Linking.openSettings() }
                        ]
                    );
                    return;
                }
                setPermissionGranted(true);
            }

            // Wait a moment to ensure the view is rendered
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (!qrRef.current) {
                throw new Error('View reference not available');
            }

            const uri = await captureRef(qrRef, {
                format: 'png',
                quality: 1.0,
                result: 'tmpfile',
            });

            await MediaLibrary.saveToLibraryAsync(uri);
            
            Alert.alert(
                'Success',
                'QR code saved to your gallery!',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error saving QR code:', error);
            Alert.alert('Error', 'Failed to save QR code. Please try again.');
        }
    };

    const handleStyleSelect = (style: string) => {
        console.log('Selected style:', style);
        setSelectedStyle(style);
        setShowStyleModal(false);
    };

    const StylePreviewCard = ({ 
        style, 
        title, 
        description, 
        isSelected 
    }: { 
        style: string; 
        title: string; 
        description: string; 
        isSelected: boolean; 
    }) => {
        const styleConfig = styleConfigs[style];
        
        return (
            <TouchableOpacity
                style={[
                    styles.styleCard,
                    isSelected && styles.selectedStyleCard,
                    { borderColor: isSelected ? color : '#e0e0e0' }
                ]}
                onPress={() => handleStyleSelect(style)}
                activeOpacity={0.7}
            >
                <View style={styles.previewImageContainer}>
                    {/* Preview simulation */}
                    <View style={[
                        styles.previewImage,
                        { backgroundColor: styleConfig.containerStyle.backgroundColor }
                    ]}>
                        {/* Profile preview */}
                        <View style={[
                            styles.previewProfileImage,
                            { 
                                width: styleConfig.profileImageSize * 0.5,
                                height: styleConfig.profileImageSize * 0.5,
                                borderColor: color,
                                borderWidth: style === 'modern' ? 3 : 2,
                            }
                        ]}>
                            {image ? (
                                <Image 
                                    source={{ uri: image }} 
                                    style={styles.previewProfileImage}
                                />
                            ) : (
                                <Text style={styles.previewInitials}>
                                    {name?.charAt(0) || '?'}
                                </Text>
                            )}
                        </View>
                        
                        {/* QR preview */}
                        <View style={[
                            styles.previewQr,
                            { 
                                width: qrSize * 0.3,
                                height: qrSize * 0.3,
                                backgroundColor: styleConfig.qrBackgroundColor,
                                borderWidth: styleConfig.qrBorderWidth,
                            }
                        ]}>
                            <Text style={styles.previewQrText}>QR</Text>
                        </View>
                        
                        {/* Style indicator */}
                        <Text style={[
                            styles.previewStyleText,
                            { 
                                fontSize: style === 'classic' ? 14 : 
                                        style === 'modern' ? 16 : 12,
                                fontWeight: styleConfig.nameFontWeight,
                                letterSpacing: styleConfig.nameLetterSpacing,
                                ...(style === 'elegant' && { textTransform: 'uppercase' })
                            }
                        ]}>
                            {style}
                        </Text>
                    </View>
                </View>
                <View style={styles.previewInfo}>
                    <Text style={[
                        styles.previewTitle,
                        { 
                            fontWeight: style === 'classic' ? '700' : 
                                     style === 'modern' ? '600' : '500',
                            letterSpacing: styleConfig.nameLetterSpacing,
                            ...(style === 'elegant' && { textTransform: 'uppercase' })
                        }
                    ]}>
                        {title}
                    </Text>
                    <Text style={styles.previewDescription}>
                        {description}
                    </Text>
                    <View style={[
                        styles.previewSelectButton,
                        { backgroundColor: isSelected ? color : '#4CAF50' }
                    ]}>
                        <Text style={styles.previewSelectButtonText}>
                            {isSelected ? 'Selected' : 'Select'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Main QR content to be captured
    const QRContent = () => (
        <View style={[
            styles.qrContainer,
            currentStyle.containerStyle,
            styles.captureContainer,
            { padding: currentStyle.containerPadding }
        ]}>
            {/* Profile Image */}
            {image && (
                <View style={[
                    styles.profileImageContainer,
                    { marginBottom: currentStyle.profileImageSize / 5 }
                ]}>
                    <Image 
                        source={{ uri: image }} 
                        style={[
                            styles.profileImage,
                            { 
                                width: currentStyle.profileImageSize,
                                height: currentStyle.profileImageSize,
                                borderColor: color,
                                borderWidth: selectedStyle === 'modern' ? 4 : 3,
                            }
                        ]}
                        onError={() => console.log('Image failed to load')}
                    />
                </View>
            )}
            
            {/* Name */}
            {name && (
                <Text style={[
                    styles.name,
                    { 
                        fontSize: currentStyle.nameFontSize,
                        color: '#333',
                        marginBottom: image ? 10 : 15,
                        fontWeight: currentStyle.nameFontWeight,
                        letterSpacing: currentStyle.nameLetterSpacing,
                        ...('nameTextTransform' in currentStyle && { 
                            textTransform: currentStyle.nameTextTransform 
                        })
                    }
                ]}>
                    {name}
                </Text>
            )}
            
            {/* QR Code */}
            <View style={[
                styles.qrWrapper,
                { 
                    backgroundColor: currentStyle.qrBackgroundColor,
                    borderWidth: currentStyle.qrBorderWidth,
                    borderColor: '#e0e0e0',
                    padding: selectedStyle === 'elegant' ? 15 : 12,
                }
            ]}>
                <QRCode
                    value={expoUrl}
                    size={qrSize}
                    backgroundColor={currentStyle.qrBackgroundColor}
                    color={color}
                />
            </View>
            
            {/* Social Media Links using IconWithName */}
            {userLinks.length > 0 && (
                <View style={[
                    styles.socialContainer,
                    { marginTop: selectedStyle === 'elegant' ? 15 : 10 }
                ]}>
                    {userLinks.slice(0, 4).map((link, index) => (
                        <View key={index} style={[
                            styles.socialItem,
                            selectedStyle === 'modern' && styles.modernSocialItem,
                            selectedStyle === 'elegant' && styles.elegantSocialItem,
                        ]}>
                            <IconWithName
                                name={link.name}
                                iconName={link.iconName}
                                link={link.link}
                                fontSize={selectedStyle === 'elegant' ? 12 : 14}
                                iconSize={selectedStyle === 'elegant' ? 18 : 20}
                                color={color}
                            />
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Share Profile</Text>
                
                <View style={styles.qrPreviewContainer}>
                    {/* This is the view that will be captured */}
                    <View 
                        ref={qrRef} 
                        style={styles.captureWrapper}
                        collapsable={false}
                    >
                        <QRContent />
                    </View>
                </View>

                {/* Style Selection Button */}
                <Button
                    text="Choose Style"
                    color="gray"
                    onPress={() => setShowStyleModal(true)}
                    width={qrSize}
                    style={{ marginTop: 12 }}
                />

                {/* Current Style Indicator */}
                <Text style={styles.currentStyleText}>
                    Current style: <Text style={{ fontWeight: 'bold' }}>{selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)}</Text>
                </Text>

                {/* Download Button */}
                <Button
                    text="Download QR Code"
                    color="green"
                    bold
                    onPress={handleDownload}
                    width={qrSize}
                    style={{ marginTop: 8 }}
                />
            </View>

            {/* Style Selection Modal */}
            <Modal
                isVisible={showStyleModal}
                onBackdropPress={() => setShowStyleModal(false)}
                onBackButtonPress={() => setShowStyleModal(false)}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Choose QR Code Style</Text>
                    
                    <ScrollView 
                        style={styles.styleScroll}
                        showsVerticalScrollIndicator={false}
                    >
                        <StylePreviewCard
                            style="classic"
                            title="Classic"
                            description="Professional design with clean borders"
                            isSelected={selectedStyle === "classic"}
                        />
                        
                        <StylePreviewCard
                            style="modern"
                            title="Modern"
                            description="Sleek design with bold borders"
                            isSelected={selectedStyle === "modern"}
                        />
                        
                        <StylePreviewCard
                            style="elegant"
                            title="Elegant"
                            description="Sophisticated with refined spacing"
                            isSelected={selectedStyle === "elegant"}
                        />
                    </ScrollView>
                    
                    <View style={styles.modalFooter}>
                        <Button
                            text="Cancel"
                            color="gray"
                            onPress={() => setShowStyleModal(false)}
                            width="30%"
                        />
                        <Button
                            text="Apply Style"
                            color="green"
                            onPress={() => setShowStyleModal(false)}
                            width="30%"
                        />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    container: {
        alignItems: 'center',
        padding: 20,
        marginTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    qrPreviewContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    captureWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    captureContainer: {
        minWidth: 300,
        minHeight: 400,
    },
    qrContainer: {
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    profileImageContainer: {
        alignItems: 'center',
    },
    profileImage: {
        borderRadius: 50,
        resizeMode: 'cover',
    },
    name: {
        textAlign: 'center',
    },
    qrWrapper: {
        borderRadius: 8,
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialContainer: {
        width: '100%',
        alignItems: 'center',
    },
    socialItem: {
        width: '100%',
        maxWidth: 250,
        marginVertical: 4,
    },
    modernSocialItem: {
        paddingHorizontal: 10,
    },
    elegantSocialItem: {
        paddingHorizontal: 5,
    },
    currentStyleText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
    },
    modal: {
        justifyContent: 'center',
        margin: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        maxHeight: Dimensions.get('window').height * 0.8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    styleScroll: {
        maxHeight: Dimensions.get('window').height * 0.6,
    },
    styleCard: {
        borderWidth: 2,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginBottom: 15,
    },
    selectedStyleCard: {
        backgroundColor: '#f8fff8',
    },
    previewImageContainer: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    previewImage: {
        width: '80%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
    },
    previewProfileImage: {
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    previewInitials: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    previewQr: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        borderColor: '#ddd',
    },
    previewQrText: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },
    previewStyleText: {
        color: '#333',
        marginTop: 4,
    },
    previewInfo: {
        padding: 15,
    },
    previewTitle: {
        fontSize: 18,
        marginBottom: 8,
        color: '#333',
    },
    previewDescription: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
        marginBottom: 15,
    },
    previewSelectButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    previewSelectButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
});

export default ProfileQrCode;