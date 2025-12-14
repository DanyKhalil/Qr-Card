import React from 'react';
import {View,Text,ScrollView, StyleSheet,useWindowDimensions,} from 'react-native';
import AddressCard from '../AddressCard/AddressCard';

interface Location {
    title?: string;
    floor?: string;
    building?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    mapsLink?: string;
}

interface LocationsProps {
    locations?: Location[];
    gap?: number;
}

const Locations = ({
        locations = [],
        gap = 16,
    }: LocationsProps) => {
        const { width: screenWidth } = useWindowDimensions();

        if (!locations || locations.length === 0) {
            return null;
        }

        const getCardWidth = () => {
            if (screenWidth < 480) return screenWidth * 0.85;
            if (screenWidth < 768) return 320;
            return 360;
        };

        const cardWidth = getCardWidth();

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Locations</Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { 
                            paddingHorizontal: gap,
                            alignItems: 'flex-start'
                        }
                        
                    ]}
                    decelerationRate="fast"
                    snapToInterval={cardWidth + gap}
                    // snapToAlignment="center"
                >
                    {locations.map((location, index) => (
                        <View
                            key={index}
                            style={[
                            styles.locationCard,
                            {
                                width: cardWidth,
                                marginRight: index === locations.length - 1 ? gap : 0
                            }
                            ]}
                        >
                            <AddressCard
                            title={location.title}
                            floor={location.floor}
                            building={location.building}
                            street={location.street}
                            city={location.city}
                            state={location.state}
                            country={location.country}
                            mapsLink={location.mapsLink}
                            borderColor="#6a8adbff"
                            borderWidth={2}
                            />
                        </View>
                    ))}
                </ScrollView>

                {locations.length > 1 && (
                    <View style={styles.dotsContainer}>
                        {locations.map((_, index) => (
                            <View
                            key={index}
                            style={styles.dot}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        paddingVertical: 16,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        lineHeight: 32,
    },
    scrollContent: {
        paddingVertical: 8,
    },
    locationCard: {
        marginHorizontal: 8,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ddd',
    },
});

export default Locations;