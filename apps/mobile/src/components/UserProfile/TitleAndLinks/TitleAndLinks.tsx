import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import IconWithName from '../IconWithName/IconWithName';

interface SocialLink {
    name: string;
    iconName: string;
    link?: string;
}

interface TitleAndLinksProps {
    title: string;
    links?: any[];
}

const TitleAndLinks = ({ title, links = [] }: TitleAndLinksProps) => {
    const { width: screenWidth } = useWindowDimensions();

    if (!links || !Array.isArray(links) || links.length === 0) {
        return null;
    }

    const getTitleFontSize = () => {
        if (screenWidth < 480) return 20;
        if (screenWidth < 768) return 22;
        if (screenWidth < 1024) return 24;
        return 28;
    };

    const getNumColumns = () => {
        if (screenWidth < 480) return 1;
        if (screenWidth < 768) return 1;
        if (screenWidth < 1024) return 2;
        return 3;
    };

    const numColumns = getNumColumns();
    const isGridLayout = numColumns > 1;

    return (
        <View style={[
            styles.container,
            { paddingHorizontal: screenWidth < 480 ? 15 : screenWidth < 768 ? 20 : 30 }
            ]}
        >
            <Text style={[styles.title, { fontSize: getTitleFontSize() }]}>
                {title}
            </Text>

            <View style={[
                styles.linksContainer,
                isGridLayout && styles.gridContainer,
                !isGridLayout && styles.columnContainer
            ]}>
                {links.map((social, index) => (
                    <View
                        key={index}
                        style={[
                            styles.linkItem,
                            isGridLayout && { 
                                width: `${100 / numColumns}%`,
                                paddingHorizontal: 8
                            }
                        ]}
                    >
                        <IconWithName
                            name={social.name}
                            iconName={social.iconName}
                            link={social.link}
                            fontSize={screenWidth < 480 ? 16 : 18}
                            iconSize={screenWidth < 480 ? 20 : 22}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    title: {
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    linksContainer: {
        width: '100%',
    },
    columnContainer: {
        gap: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    linkItem: {
        marginBottom: 8,
    },
});

export default TitleAndLinks;