import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import CustomItemCard from "../CustomItemCard/CustomItemCard";

const CustomContentDisplay = ({ customContent }) => {
  return (
    <ScrollView style={styles.customContentSection}>
      <Text style={styles.customContentTitle}>{customContent.name}</Text>

      <View style={styles.customCardsGrid}>
        {customContent.items.map((item) => (
          <CustomItemCard
            key={item.id}
            customItem={{
              title: item.title,
              fields: customContent.fields,
              values: item.values.reduce((acc, val) => {
                if (val.field_key && val.value !== undefined) acc[val.field_key] = val.value;
                return acc;
              }, {}),
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  customContentSection: {
    padding: 20,
    maxWidth: 800,
    margin: 0,
    marginBottom: 70,
  },
  customContentTitle: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 32,
    color: "#1f2937",
    textAlign: "left",
  },
  customCardsGrid: {
    flexDirection: "column",
    gap: 24, 
  },
});

export default CustomContentDisplay;