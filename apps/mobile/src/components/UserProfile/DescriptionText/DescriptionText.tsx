import React from 'react';
import { Text, StyleSheet, useWindowDimensions } from 'react-native';

interface DescriptionTextProps {
    text: string;
    style?: any;
}

const DescriptionText = ({ text, style }: DescriptionTextProps) => {
    const { width: screenWidth } = useWindowDimensions();

    // This is for responsive screen for small an d big phones
    const getFontSize = () => {
        if (screenWidth < 360) return 14;
        if (screenWidth < 768) return 16 ;
        if (screenWidth < 1024) return 17; 
        if (screenWidth < 1440) return 18; 
        return 20;
    };
    const getLineHeight = () => {
        if (screenWidth < 360) return 20;
        if (screenWidth < 768) return 24;
        if (screenWidth < 1024) return 26;
        if (screenWidth < 1440) return 28;
        return 30;
    };
    const getPadding = () => {
        if (screenWidth < 360) return { paddingHorizontal: 10 };
        if (screenWidth < 768) return { paddingHorizontal: 20 };
        if (screenWidth < 1024) return { paddingHorizontal: 20, paddingVertical: 20 };
        if (screenWidth < 1440) return { paddingHorizontal: 30, paddingVertical: 30 };
        return { paddingHorizontal: 20, paddingVertical: 20 };
    };

    const getTextAlign = () => {
        return screenWidth < 360 ? 'left' : 'justify';
    };

    return (
        <Text 
            style={[
                styles.text,
                {
                fontSize: getFontSize(),
                lineHeight: getLineHeight(),
                textAlign: getTextAlign(),
                },
                getPadding(),
                style,
            ]}
        >
            {text}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#333',
        fontFamily: 'System',
        fontWeight: '400',
        flexWrap: 'wrap',
        marginTop: 40,
        marginBottom: 30,
    },
});

export default DescriptionText;