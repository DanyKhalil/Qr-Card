import React from 'react';
import {View, Text,TouchableOpacity,StyleSheet, useWindowDimensions, Alert  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconWithNameProps {
    id: string;
    name: string;
    iconName: string;
    setter:  React.Dispatch<React.SetStateAction<any[]>>;
    fontSize?: number;
    iconSize?: number;
}

const IconWithName = ({
    id,
    name,
    iconName,
    setter,
    fontSize = 16,
    iconSize = 20,
}: IconWithNameProps) => {
    const { width: screenWidth } = useWindowDimensions();

    const getIconName = (icon: string) => {
        const lowerIcon = icon.toLowerCase();
        
        const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
            whatsapp: 'logo-whatsapp',
            facebook: 'logo-facebook',
            instagram: 'logo-instagram',
            tiktok: 'musical-notes',
            youtube: 'logo-youtube',
            x: 'logo-twitter',
            twitter: 'logo-twitter',
            linkedin: 'logo-linkedin',
            github: 'logo-github',
            phone: 'call',
            email: 'mail',
            web: 'globe',
        };

        return iconMap[lowerIcon] || 'help-circle';
    };

    const handleRemovePress = () => {
        Alert.alert(
            'Remove Link',
            'Are you sure you want to remove this link?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setter((oldLinks) => oldLinks.filter((link) => link.id !== id));
                    },
                },
            ]
        );
    };

    const isSmallScreen = screenWidth < 480;
    const isMediumScreen = screenWidth < 768;

    return (
        <View style={[
            styles.container,
            isSmallScreen && styles.smallContainer,
            isMediumScreen && styles.mediumContainer
        ]}>
            <TouchableOpacity
                style={[
                    styles.removeButton,
                    isSmallScreen && styles.smallRemoveButton,
                    isMediumScreen && styles.mediumRemoveButton
                ]}
                onPress={handleRemovePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="close" size={isSmallScreen ? 12 : 14} color="white" />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
                <Ionicons 
                name={getIconName(iconName)} 
                size={isSmallScreen ? 18 : iconSize} 
                color="#6C63FF" 
                />
            </View>

            <Text 
                style={[
                styles.nameText,
                { fontSize: isSmallScreen ? 14 : fontSize },
                isSmallScreen && styles.smallNameText,
                isMediumScreen && styles.mediumNameText
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {name}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        // backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginVertical: 4,
    },
    mediumContainer: {
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    smallContainer: {
        gap: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameText: {
        color: '#333',
        flex: 1,
        fontWeight: '500',
    },
    mediumNameText: {
        fontSize: 15,
    },
    smallNameText: {
        fontSize: 14,
    },
    removeButton: {
        backgroundColor: '#e63946',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediumRemoveButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
    },
    smallRemoveButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
});

export default IconWithName;