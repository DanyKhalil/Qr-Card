import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CustomItemCard = ({ customItem }) => {
  if (!customItem) return null;

  const { title, fields, values } = customItem;

  return (
    <View style={styles.customCard}>
      <Text style={styles.customCardTitle}>{title || "Untitled"}</Text>
      <View style={styles.customCardFields}>
        {fields.map((field) => (
          <View style={styles.customCardField} key={field.key}>
            <Text style={styles.fieldLabel}>{field.label}:</Text>
            <Text style={styles.fieldValue}>{values?.[field.key] ?? "N/A"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  customCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333333",
  },
  customCardFields: {
    gap: 10,
  },
  customCardField: {
    borderWidth: 1,
    borderColor: "#FF8559",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  fieldLabel: {
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 3,
  },
  fieldValue: {
    color: "#333333",
    flexWrap: "wrap",
  },
});

export default CustomItemCard;