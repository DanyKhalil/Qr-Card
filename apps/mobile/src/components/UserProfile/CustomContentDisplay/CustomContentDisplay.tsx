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
        {customContent.description && (
          <Text style={styles.customContentDescription}>
            {customContent.description}
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          // { paddingHorizontal: gap }
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
              cardLayout={true}
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    maxWidth: 800,
    marginBottom: 30,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0DEFF',
  },
  customContentTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#202337",
    marginBottom: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textAlign: "left",
  },
  customContentDescription: {
    fontSize: 16,
    color: "#414866",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textAlign: "left",
    lineHeight: 22,
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