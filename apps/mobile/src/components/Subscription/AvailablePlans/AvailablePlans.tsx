import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from "react-native";

const AvailablePlans = ({ plans = [], onPlanSelect, selectedPlanId }) => {
  if (!plans.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Plans</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;

          return (
            <View
              style={[
                styles.planCard,
                isSelected && styles.selectedCard
              ]}
              key={plan.id}
            >
              <Text style={[
                styles.planName,
                isSelected && styles.selectedText
              ]}>
                {plan.name}
              </Text>
              
              <Text style={[
                styles.planDescription,
                isSelected && styles.selectedText
              ]}>
                {plan.description}
              </Text>
              
              <Text style={[
                styles.planPrice,
                isSelected && styles.selectedText
              ]}>
                Price: ${plan.price} {plan.currency}
              </Text>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  isSelected && styles.selectedButton
                ]}
                onPress={() => onPlanSelect(plan)}
                disabled={isSelected}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>
                  {isSelected ? "Selected" : "Choose Plan"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2A3550",
    marginTop: 40,
    marginBottom: 16,
    textAlign: "center",
  },
  scrollContent: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  planCard: {
    backgroundColor: "#d8e3f6",
    borderRadius: 12,
    padding: 20,
    width: CARD_WIDTH,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    backgroundColor: "#4068e8",
    transform: [{ scale: 1.05 }],
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 8,
    borderColor: "#1e3a8a",
  },
  planName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2A3550",
    marginBottom: 8,
    textAlign: "center",
  },
  planDescription: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 12,
    textAlign: "center",
  },
  planPrice: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  selectedText: {
    color: "#ffffff",
  },
  selectButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#22c55e",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default AvailablePlans;