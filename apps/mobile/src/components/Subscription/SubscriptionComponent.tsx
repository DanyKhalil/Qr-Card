import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import CurrentSubscription from "./CurrentSubscription/CurrentSubscription";
import AvailablePlans from "./AvailablePlans/AvailablePlans";
import PaymentMethod from "./PaymentMethod/PaymentMethod";
import ReceiptUploadModal from "./ReceiptModal/ReceiptModal";
import { subscriptionApi } from "../../services/subscriptionApi";

/* ===================== TYPES ===================== */

interface Plan {
  id: string;
  name: string;
  price: number;
  billing_interval: string;
}

interface PaymentDetails {
  method: string;
  notes: string;
}

interface CurrentUser {
  subscription?: {
    id: string;
    status: string;
  };
}

interface SubscriptionComponentProps {
  profileId: any,
  plans?: Plan[];
  currentUser?: CurrentUser;
  refreshPlans?: () => void;
}

/* ===================== COMPONENT ===================== */

const SubscriptionComponent: React.FC<SubscriptionComponentProps> = ({
  profileId,
  plans = [],
  currentUser,
  refreshPlans,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentMethod] = useState("bank_transfer");
  const [receiptFile, setReceiptFile] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const currentSubscription = currentUser?.subscription ?? null;

  /* ===================== IMAGE PICKER ===================== */

  const pickReceiptImage = async () => {
    if (subscribing) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      Alert.alert("File too large", "Maximum size is 5MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (asset.mimeType && !validTypes.includes(asset.mimeType)) {
      Alert.alert("Invalid file", "Only image files are allowed.");
      return;
    }

    setReceiptFile({
      uri: asset.uri,
      name: asset.fileName ?? "receipt.jpg",
      type: asset.mimeType ?? "image/jpeg",
      size: asset.fileSize ?? 0,
    });
  };

  const clearReceiptFile = () => setReceiptFile(null);

  /* ===================== SUBSCRIBE ===================== */

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setSubscribing(true);
    setSubscribeMessage("");

    try {
      const paymentDetails: PaymentDetails = {
        method: paymentMethod,
        notes: "Subscription payment",
      };

      await subscriptionApi.subscribeToPlan(
        profileId,
        selectedPlan.id,
        paymentDetails,
        receiptFile
      );

      setSubscribeMessage("Subscription created! Pending admin approval.");

      setSelectedPlan(null);
      setShowPayment(false);
      setReceiptFile(null);

      refreshPlans?.();
      router.replace("/(tabs)/profile");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <ScrollView style={styles.container}>
      <CurrentSubscription />

      <AvailablePlans
        plans={plans}
        onPlanSelect={(plan) => {
          setSelectedPlan(plan);
          setShowPayment(true);
        }}
        selectedPlanId={selectedPlan?.id}
      />

      {showPayment && selectedPlan && (
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>
            Complete Subscription: {selectedPlan.name}
          </Text>

          <Text style={styles.priceDisplay}>
            ${selectedPlan.price} / {selectedPlan.billing_interval}
          </Text>

          {/* Receipt Upload */}
          <View style={styles.receiptUploadSection}>
            <Text style={styles.sectionTitle}>Upload Payment Receipt</Text>

            <TouchableOpacity
              style={styles.fileUploadArea}
              onPress={pickReceiptImage}
            >
              <Text style={styles.uploadIcon}>📎</Text>
              <Text style={styles.uploadText}>
                {receiptFile ? receiptFile.name : "Tap to choose receipt image"}
              </Text>
            </TouchableOpacity>

            {receiptFile && (
              <View style={styles.fileInfo}>
                <Text>{receiptFile.name}</Text>
                <TouchableOpacity onPress={clearReceiptFile}>
                  <Text style={styles.removeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {subscribeMessage !== "" && (
            <Text style={styles.successText}>{subscribeMessage}</Text>
          )}

          {/* Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setSelectedPlan(null);
                setShowPayment(false);
                setReceiptFile(null);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.subscribeButton,
                (!receiptFile || subscribing) && styles.disabledButton,
              ]}
              onPress={handleSubscribe}
              disabled={!receiptFile || subscribing}
            >
              {subscribing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.subscribeText}>Complete Subscription</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <PaymentMethod plan={selectedPlan} />
    </ScrollView>
  );
};

export default SubscriptionComponent;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  paymentSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    margin: 16,
  },
  paymentTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  priceDisplay: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 12,
  },
  receiptUploadSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  fileUploadArea: {
    padding: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadText: {
    marginTop: 8,
    fontWeight: "600",
  },
  fileInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  removeIcon: {
    color: "#dc2626",
    fontSize: 18,
  },
  successText: {
    marginTop: 16,
    color: "#16a34a",
    textAlign: "center",
  },
  actionsContainer: {
    marginTop: 24,
    gap: 16,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
  },
  cancelText: {
    fontWeight: "600",
  },
  subscribeButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  subscribeText: {
    color: "#fff",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
