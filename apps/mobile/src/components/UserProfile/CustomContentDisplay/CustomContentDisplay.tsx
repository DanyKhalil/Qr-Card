import React from "react";
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import CustomItemCard from "../CustomItemCard/CustomItemCard";

const CustomContentDisplay = ({ customContent, gap = 16 }) => {
  const { width: screenWidth } = useWindowDimensions();

  if (!customContent?.items || customContent.items.length === 0) {
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
        <Text style={styles.customContentTitle}>{customContent.name}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: gap }
        ]}
        decelerationRate="fast"
        snapToInterval={cardWidth + gap}
        snapToAlignment="center"
      >
        {customContent.items.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.customCard,
              {
                width: cardWidth,
                marginRight: index === customContent.items.length - 1 ? gap : 0
              }
            ]}
          >
            <CustomItemCard
              customItem={{
                title: item.title,
                fields: customContent.fields,
                values: item.values.reduce((acc, val) => {
                  if (val.field_key && val.value !== undefined) acc[val.field_key] = val.value;
                  return acc;
                }, {}),
              }}
            />
          </View>
        ))}
      </ScrollView>

      {customContent.items.length > 1 && (
        <View style={styles.dotsContainer}>
          {customContent.items.map((_, index) => (
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
    maxWidth: 800,
    marginBottom: 70,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  customContentTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "left",
  },
  scrollContent: {
    paddingVertical: 8,
    alignItems: "flex-start",
  },
  customCard: {
    marginHorizontal: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ddd",
  },
});

export default CustomContentDisplay;