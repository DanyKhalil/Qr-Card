import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,useWindowDimensions,Linking,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddressCardProps {
    title?: string;
    floor?: string;
    building?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    mapsLink?: string;
    borderColor?: string;
    borderWidth?: number;
    style?: any;
}

const AddressCard = ({
        title,
        floor,
        building,
        street,
        city,
        state,
        country,
        mapsLink,
        borderColor = '#476b85ff',
        borderWidth = 2,
        style,
    }: AddressCardProps) => {
        const { width: screenWidth } = useWindowDimensions();

        if (!street && !city && !country) {
            return null;
        }

        const handleMapsPress = async () => {
            if (!mapsLink) return;
            
            try {
            const canOpen = await Linking.canOpenURL(mapsLink);
            if (canOpen) {
                await Linking.openURL(mapsLink);
            }
            } catch (error) {
            console.error('Failed to open maps:', error);
            }
        };

        const AddressLine = ({ label, value }: { label: string; value: string }) => (
            <View style={styles.addressLine}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value} numberOfLines={2}>{value}</Text>
            </View>
        );

        return (
            <View style={[
                    styles.container,
                    { 
                        borderColor,
                        borderWidth,
                        maxWidth: screenWidth < 768 ? screenWidth - 40 : 400 
                    },
                    style
                ]}
            >
                {title && String(title).trim() !== "" && (
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{String(title)}</Text>
                    </View>
                )}

                <View style={styles.detailsContainer}>
                    {floor && <AddressLine label="Floor:" value={floor} />}
                    {building && <AddressLine label="Building:" value={building} />}
                    {street && <AddressLine label="Street:" value={street} />}
                    {city && <AddressLine label="City:" value={city} />}
                    {state && <AddressLine label="State:" value={state} />}
                    {country && <AddressLine label="Country:" value={country} />}
                </View>

                {mapsLink && (
                    <TouchableOpacity
                        style={styles.mapsButton}
                        onPress={handleMapsPress}
                        activeOpacity={0.8}
                        >
                        <Ionicons name="location" size={20} color="white" />
                        <Text style={styles.mapsButtonText}>Open in Maps</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F3FF', // soft lavender
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#4B4C7A', // muted indigo shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0D9F9', // soft lavender border
    paddingBottom: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4B4C7A', // muted indigo
  },
  detailsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  addressLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6C8A', // lighter muted indigo
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#4B4C7A', // muted indigo
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C8C1F9', // muted indigo button
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#A89EE8', // soft lavender shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  mapsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default AddressCard;