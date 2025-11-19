import React from 'react';
import {View,Text, TouchableOpacity, StyleSheet, Linking,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconWithNameProps {
    name?: string;
    iconName: string;
    link?: string;
    fontSize?: number;
    iconSize?: number;
    color?: string;
}

const IconWithName = ({
        name,
        iconName,
        link,
        fontSize = 16,
        iconSize = 20,
        color = '#47855B',
    }: IconWithNameProps) => {
  
        const getIconName = (icon: string) => {
            const lowerIcon = icon.toLowerCase();

            // this to know which icon to pass to ioniocn
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

        const handlePress = async () => {
            if (!iconName) return;

            const lowerIcon = iconName.toLowerCase();
            let url = '';

            try {
                switch (lowerIcon) {
                    case 'email':
                        url = `mailto:${link || name}`;
                        break;

                    case 'phone':
                        const raw = link ?? name;
                        url = `tel:${raw}`;
                        break;

                    case 'whatsapp':
                        if (link) {
                            url = link;
                        } else if (name) {
                            const number = name.replace(/\D/g, '');
                            url = `https://wa.me/${number}`;
                        }
                        break;

                    default:
                        if (link) {
                            url = /^https?:\/\//i.test(link) ? link : `https://${link}`;
                        } else if (name) {
                            url = /^https?:\/\//i.test(name) ? name : `https://${name}`;
                        }
                        break;
                }

                if (url) {
                    const canOpen = await Linking.canOpenURL(url);
                    if (canOpen) {
                        await Linking.openURL(url);
                    }
                }
            } catch (error) {
                console.error('Failed to open link:', error);
            }
        };

        const isClickable = !!(link || name);
        const iconComponent = (
            <Ionicons 
                name={getIconName(iconName)} 
                size={iconSize} 
                color={color} 
            />
        );

        const content = (
            <View style={styles.container}>
                {iconComponent}
                {name && (
                    <Text 
                    style={[
                        styles.nameText,
                        { fontSize }
                    ]}
                    numberOfLines={1}
                    >
                    {name}
                    </Text>
                )}
            </View>
        );

        if (isClickable) {
            return (
                <TouchableOpacity
                    onPress={handlePress}
                    activeOpacity={0.7}
                >
                    {content}
                </TouchableOpacity>
            );
        }

        return content;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 4,
    },
    nameText: {
        color: '#333',
        flexShrink: 1,
    },
});

export default IconWithName;