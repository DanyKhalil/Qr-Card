import React from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import AddressCard from "../AddressCard/AddressCard";
import Button from "../../UserProfile/Button/Button";

const AddressCards = ({
    addresses = [],
    setter,
    gap = 16,
    className = "",
    addAction,
    updateAction,
    objectSetter,
}) => {
    const { width } = useWindowDimensions();

    if (!addresses || addresses.length === 0) return null;

    return (
        <View style={[styles.section, className && { marginVertical: 8 }]}>
            <Text style={styles.title}>Addresses</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.addressRow, { gap }]}
            >
                {addresses.map((address, index) => (
                    <View key={index} style={styles.cardWrapper}>
                        <AddressCard
                            id={address.id}
                            title={address.title}
                            floor={address.floor}
                            building={address.building}
                            street={address.street}
                            city={address.city}
                            state={address.state}
                            country={address.country}
                            googleMapsUrl={address.maps_url}
                            setter={setter}
                            updateAction={updateAction}
                            objectSetter={objectSetter}
                        />
                    </View>
                ))}
            </ScrollView>

            <Button
                text="Add Location"
                color="green"
                width="100%"
                action={addAction}
                style={{ marginTop: 16 }}
            />
        </View>
    );
};

export default AddressCards;

const styles = StyleSheet.create({
    section: {
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",
        paddingVertical: 20,
        paddingHorizontal: 20,
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 16,
        color: "#333",
    },

    addressRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingBottom: 8,
    },

    cardWrapper: {
        width: 350,
        borderRadius: 12,
        overflow: "hidden",
    },
});
