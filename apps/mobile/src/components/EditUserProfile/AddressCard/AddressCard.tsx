import React from "react";
import { View, Text, StyleSheet, useWindowDimensions, Alert, ScrollView } from "react-native";
import Button from "../../UserProfile/Button/Button";

export interface Location {
    id: string;
    title: string;
    floor: string;
    building: string;
    street: string;
    city: string;
    state: string;
    country: string;
    maps_url: string;
}

interface AddressCardProps {
    id: string;
    title?: string;
    floor?: string;
    building?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    googleMapsUrl?: string;
    setter: React.Dispatch<React.SetStateAction<Location[]>>;
    updateAction: () => void;
    objectSetter: (location: Location) => void;
}

const AddressCard = ({
    id,
    title,
    floor,
    building,
    street,
    city,
    state,
    country,
    googleMapsUrl,
    setter,
    updateAction,
    objectSetter,
}: AddressCardProps) => {
    const { width: screenWidth } = useWindowDimensions();
    const isMediumScreen = screenWidth < 768;

    const locationObject: Location = {
        id,
        title: title || "",
        floor: floor || "",
        building: building || "",
        street: street || "",
        city: city || "",
        state: state || "",
        country: country || "",
        maps_url: googleMapsUrl || "",
    };

    const handleDeleteLocation = () => {
        Alert.alert("Remove Location", "Are you sure you want to remove this location?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => {
                    setter((prev) => prev.filter((loc) => loc.id !== id));
                },
            },
        ]);
    };

    const handleEdit = () => {
        objectSetter(locationObject);
        updateAction();
    };

    const fields: [string, string | undefined][] = [
        ["Title", title],
        ["Floor", floor],
        ["Building", building],
        ["Street", street],
        ["City", city],
        ["State", state],
        ["Country", country],
        ["Google Maps URL", googleMapsUrl],
    ].filter(([, value]) => value && value.trim() !== "");

    return (
        <View style={styles.card}>
            {fields.map(([label, value]) => {
                if (label === "Google Maps URL") {
                    return (
                        <View key={label} style={styles.field}>
                            <Text style={styles.label}>{label}:</Text>
                            <ScrollView
                                horizontal
                                contentContainerStyle={styles.urlField}
                                showsHorizontalScrollIndicator={false}
                            >
                                <Text style={styles.urlText}>{value}</Text>
                            </ScrollView>
                        </View>
                    );
                }
                return (
                    <View key={label} style={styles.field}>
                        <Text style={styles.label}>{label}:</Text>
                        <View style={styles.textField}>
                            <Text style={styles.text}>{value}</Text>
                        </View>
                    </View>
                );
            })}

            <View
                style={[
                    styles.buttonsContainer,
                    isMediumScreen && styles.buttonsColumn,
                ]}
            >
                <Button text="Edit" color="green" onPress={handleEdit} width={isMediumScreen ? "100%" : 100} />
                <Button text="Remove" color="coral" onPress={handleDeleteLocation} width={isMediumScreen ? "100%" : 100} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: "#4F46E5", // Indigo border
        borderRadius: 12,
        padding: 20,
        backgroundColor: "#EDE9FE", // Soft Lavender background
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        width: "100%",
        marginVertical: 8,
        gap: 12,
    },

    field: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        width: "100%",
    },

    label: {
        width: 100,
        fontSize: 14,
        fontWeight: "600",
        color: "#312E81", // Dark Indigo text
    },

    textField: {
        flex: 1,
        padding: 12,
        backgroundColor: "#EDE9FE", // Soft Lavender input background
        borderRadius: 8,
        borderColor: "#C4B5FD", // Lighter Indigo border
        borderWidth: 1,
        justifyContent: "center",
    },

    text: {
        fontSize: 15,
        color: "#312E81", // Dark Indigo text
    },

    urlField: {
        padding: 12,
        backgroundColor: "#EDE9FE", // Soft Lavender
        borderRadius: 8,
        borderColor: "#C4B5FD",
        borderWidth: 1,
    },
    urlText: {
        color: "#4F46E5", // Indigo URL text
        fontFamily: "monospace",
    },

    buttonsContainer: {
        flexDirection: "row",
        gap: 8,
        justifyContent: "flex-end",
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#DDD6FE", // Soft Indigo divider
    },
    buttonsColumn: {
        flexDirection: "column",
        gap: 8,
    },
});



export default AddressCard;
