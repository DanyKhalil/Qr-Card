import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions,} from 'react-native';
import IconWithName from '../IconWithName/IconWithName';
import Button from '../../UserProfile/Button/Button';

interface SocialLink {
    id: string;
    name: string;
    iconName: string;
    link?: string;
}

interface TitleAndLinksProps {
    title: string;
    links?: SocialLink[];
    setter: (links: SocialLink[]) => void;
    addAction: () => void;
}

const TitleAndLinks = ({ 
    title, 
    links = [], 
    setter, 
    addAction 
}: TitleAndLinksProps) => {
    const { width: screenWidth } = useWindowDimensions();

    if (!links || !Array.isArray(links) || links.length === 0) {
        return null;
    }

    const getTitleFontSize = () => {
        if (screenWidth < 480) return 20;
        if (screenWidth < 768) return 22;
        return 24;
    };

    const getPaddingHorizontal = () => {
        if (screenWidth < 480) return 15;
        if (screenWidth < 768) return 20;
        return 20;
    };

    const getPaddingRight = () => {
        if (screenWidth < 480) return 15;
        if (screenWidth < 768) return 30;
        return 10;
    };

    return (
        <View style={[
            styles.container,
            { 
                paddingLeft: getPaddingHorizontal(),
                paddingRight: getPaddingRight()
            }
        ]}>
            <Text style={[styles.title, { fontSize: getTitleFontSize() }]}>
                {title}
            </Text>
            <View style={styles.linksContainer}>
                {links.map((social, index) => (
                    <IconWithName 
                        key={social.id || index}
                        id={social.id}
                        name={social.name}
                        iconName={social.iconName}
                        setter={setter}
                        fontSize={screenWidth < 480 ? 14 : 16}
                        iconSize={screenWidth < 480 ? 18 : 20}
                    />
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <Button 
                text="Add Links"
                color="green"
                width={150}
                onPress={addAction}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    title: {
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        textAlign: 'left',
    },
    linksContainer: {
        gap: 10,
        width: '100%',
        marginBottom: 16,
    },
    buttonContainer: {
        alignItems: 'flex-start',
    },
});

export default TitleAndLinks;