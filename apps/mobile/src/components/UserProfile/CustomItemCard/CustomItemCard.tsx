import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Dimensions 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { DEVELOPMENT_CONFIG } from '../../../config/development';

const CustomItemCard = ({ customItem, cardLayout = true }) => {
  if (!customItem) return null;

  const { title, fields, values } = customItem;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const transformImageUrl = (url: string) => {
      if (!url) 
          return url;
      let transformedUrl = url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl)
      return transformedUrl;
  };

  // Get all image URLs from the item
  const getImageUrls = () => {
    const imageUrls = [];
    
    fields.forEach(field => {
      if (field.type === 'image' && values?.[field.key]) {
        const value = values[field.key];
        // Handle both string URLs and object URIs
        if (typeof value === 'string') {
          imageUrls.push(value);
        } else if (value && typeof value === 'object' && value.uri) {
          imageUrls.push(value.uri);
        }
      }
    });
    
    return imageUrls;
  };

  const imageUrls = getImageUrls();
  const hasImages = imageUrls.length > 0;

  // Helper function to check if value is an image URL
  const isImageUrl = (value) => {
    if (!value) return false;
    
    let url = value;
    if (typeof value === 'object' && value.uri) {
      url = value.uri;
    }
    
    if (typeof url !== 'string') return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const isImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().endsWith(ext)
    );
    
    const isImageUrlPattern = (
      url.startsWith('http://') || 
      url.startsWith('https://') || 
      url.startsWith('file://') ||
      url.includes('blob:') ||
      url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/i)
    );
    
    return isImageExtension || isImageUrlPattern;
  };

  // Helper function to check if field type is image
  const isImageField = (field) => {
    return field.type === 'image' || isImageUrl(values?.[field.key]);
  };

  // Helper function to format values
  const formatValue = (value, fieldType) => {
    if (fieldType === 'boolean') {
      return typeof value === "boolean" ? (value ? "Yes" : "No") : "N/A";
    }
    
    if (fieldType === 'image') {
      return "N/A";
    }
    
    if (!value && value !== 0 && value !== false) {
      return "N/A";
    }
    
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return "[Object]";
      }
    }
    
    return String(value);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  // Reset image index when customItem changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [customItem]);

  if (cardLayout) {
    return (
      <View style={styles.customCardLayout}>
        {/* Image Carousel Section */}
        {hasImages && (
          <View style={styles.cardImageSection}>
            <View style={styles.imageCarousel}>
              <Image 
                source={{ uri: transformImageUrl(imageUrls[currentImageIndex]) }} 
                style={styles.carouselImage}
                resizeMode="cover"
                onError={() => console.log('Image load error')}
              />
              
              {/* Navigation Arrows */}
              {imageUrls.length > 1 && (
                <>
                  <TouchableOpacity 
                    style={[styles.carouselArrow, styles.carouselArrowLeft]}
                    onPress={handlePrevImage}
                  >
                    <Ionicons name="chevron-back" size={24} color="#2c2f48" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.carouselArrow, styles.carouselArrowRight]}
                    onPress={handleNextImage}
                  >
                    <Ionicons name="chevron-forward" size={24} color="#2c2f48" />
                  </TouchableOpacity>
                </>
              )}
            </View>
            
            {/* Image Indicators */}
            {imageUrls.length > 1 && (
              <View style={styles.imageIndicators}>
                {imageUrls.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentImageIndex && styles.indicatorActive
                    ]}
                    onPress={() => setCurrentImageIndex(index)}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* Title */}
          <Text style={styles.cardTitle}>{title || "Untitled"}</Text>
          
          {/* Fields */}
          <ScrollView style={styles.cardFields}>
            {fields
              .filter(field => !isImageField(field)) // Exclude image fields from list
              .map((field) => {
                const value = values?.[field.key];
                
                return (
                  <View style={styles.cardField} key={field.key}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>{field.label}:</Text>
                      <Text style={styles.fieldValue}>
                        {formatValue(value, field.type)}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Original layout (table-like)
  return (
    <View style={styles.customCard}>
      <Text style={styles.customCardTitle}>{title || "Untitled"}</Text>
      <ScrollView style={styles.customCardFields}>
        {fields.map((field) => {
          const value = values?.[field.key];
          const isImage = isImageField(field);
          
          return (
            <View style={[
              styles.customCardField,
              isImage && styles.imageField
            ]} key={field.key}>
              <Text style={styles.fieldLabel}>{field.label}:</Text>
              
              {isImage && value ? (
                <View style={styles.imageValueContainer}>
                  <Image 
                    source={{ uri: typeof value === 'object' ? transformImageUrl(value.uri) : transformImageUrl(value) }} 
                    style={styles.fieldImage}
                    resizeMode="contain"
                    onError={() => console.log('Image load error')}
                  />
                </View>
              ) : (
                <Text style={styles.fieldValue}>
                  {formatValue(value, field.type)}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Original card container
  customCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  customCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c2f48",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  customCardFields: {
    maxHeight: 400,
  },
  customCardField: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: "#b0b3d6",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageField: {
    backgroundColor: "#ebebf8",
    padding: 15,
  },
  fieldLabel: {
    fontWeight: "600",
    color: "#3AAFA9",
    marginBottom: 5,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fieldValue: {
    color: "#2c2f48",
    flexWrap: "wrap",
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 20,
  },
  imageValueContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  fieldImage: {
    width: "100%",
    height: 200,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#b0b3d6",
    backgroundColor: "white",
  },

  // -------------------- NEW CARD LAYOUT --------------------
  customCardLayout: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    width: "100%",
    minHeight: 300, // Fixed height for card layout
    overflow: "hidden",
  },

  // -------------------- IMAGE SECTION --------------------
  cardImageSection: {
    backgroundColor: "#f2f2f9",
  },
  imageCarousel: {
    width: "100%",
    height: 220,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f2f2f9",
  },
  carouselArrow: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  carouselArrowLeft: {
    left: 16,
  },
  carouselArrowRight: {
    right: 16,
  },
  imageIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#b0b3c6",
  },
  indicatorActive: {
    backgroundColor: "#3AAFA9",
    transform: [{ scale: 1.2 }],
  },

  // -------------------- CONTENT --------------------
  cardContent: {
    padding: 24,
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c2f48",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5f5",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // -------------------- FIELDS --------------------
  cardFields: {
    flex: 1,
  },
  cardField: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5f5",
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
});

export default CustomItemCard;