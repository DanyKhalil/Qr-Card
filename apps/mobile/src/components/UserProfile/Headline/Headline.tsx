import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

interface HeadlineProps {
    name: string;
    dob?: string;
    headline?: string;
}

const Headline = ({ 
        name, 
        dob, 
        headline = "Your headline here"
    }: HeadlineProps) => {

        const { width: screenWidth } = useWindowDimensions();

        const calculateAge = (birthDate: string) => {
            if (!birthDate) return null;
    
            const birth = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
            }

            return age;
        };

        const age = dob ? calculateAge(dob) : null;

        const getNameFontSize = () => {
            if (screenWidth < 380) return 28;
            if (screenWidth < 480) return 32;
            return 36;
        };

        const getAgeFontSize = () => {
            if (screenWidth < 380) return 14;
            if (screenWidth < 480) return 16;
            return 18;
        };

        const getHeadlineFontSize = () => {
            if (screenWidth < 380) return 14;
            if (screenWidth < 480) return 15;
            return 16;
        };

        return (
            <View style={styles.container}>
                <View style={styles.nameAgeContainer}>
                    <Text style={[
                    styles.name,
                    { fontSize: getNameFontSize() }
                    ]}>
                    {name}
                    </Text>
                    
                    {age !== null && (
                    <Text style={[
                        styles.age,
                        { fontSize: getAgeFontSize() }
                    ]}>
                        {age} years old
                    </Text>
                    )}
                </View>
                
                <Text style={[
                    styles.headline,
                    { fontSize: getHeadlineFontSize() }
                ]}>
                    {headline}
                </Text>
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: -10,
    },
    nameAgeContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        marginBottom: 8,
        gap: 12,
    },
    name: {
        fontWeight: '700', // Bold like Instagram/Facebook
        color: '#000000',
        lineHeight: 36,
    },
    age: {
        color: '#82C294', // Your brand green
        fontWeight: '600',
        lineHeight: 20,
    },
    headline: {
        color: '#65676B', // Facebook-like gray
        lineHeight: 20,
        fontWeight: '400',
    },
});

export default Headline;