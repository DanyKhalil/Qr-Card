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
  Image,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import CurrentSubscription from "./CurrentSubscription/CurrentSubscription";
import AvailablePlans from "./AvailablePlans/AvailablePlans";
import PaymentMethod from "./PaymentMethod/PaymentMethod";
import ReceiptUploadModal from "./ReceiptModal/ReceiptModal";
import { subscriptionApi } from "../../services/subscriptionApi";
import bankIcon from "../../../assets/images/payments/bank.png";
import paypalIcon from "../../../assets/images/payments/paypal.png";
import cryptoIcon from "../../../assets/images/payments/crypto.png";

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
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
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

  const PaymentPreview = ({ icon, title, subtitle }: any) => (
    <View style={styles.paymentPreview}>
      <Image source={icon} style={styles.paymentLogo} resizeMode="contain" />
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentTitle}>{title}</Text>
        <Text style={styles.paymentSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
  /* ===================== UI ===================== */

  const PaymentInstructions = ({ method }) => {
    if (method === "bank_transfer") {
      return (
        <View style={styles.container2}>
          <Text style={styles.title2}>🏦 Bank Transfer Details</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>Account Name:</Text> Example Company Ltd
            </Text>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>Bank Name:</Text> Global Trust Bank
            </Text>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>Account Number:</Text> 1234567890
            </Text>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>IBAN:</Text> GB12 GTBK 1234 5678 9012 34
            </Text>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>SWIFT/BIC:</Text> GTBKGB2L
            </Text>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>Reference:</Text> Your Profile ID or Email
            </Text>
          </View>
          <Text style={styles.note}>
            Please complete the transfer and upload your receipt below.
          </Text>
        </View>
      );
    }

    if (method === "paypal") {
      return (
        <View style={styles.container2}>
          <Text style={styles.title2}>🅿️ PayPal Payment</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>PayPal Email:</Text> payments@example.com
            </Text>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>Payment Note:</Text> Your Profile ID or Email
            </Text>
          </View>
          <Text style={styles.note}>
            Send the payment to the email above. Then upload your receipt.
          </Text>
        </View>
      );
    }

    if (method === "crypto") {
      return (
        <View style={styles.container2}>
          <Text style={styles.title2}>💰 Crypto Wallet Details</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>Network:</Text> USDT (TRC20)
            </Text>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>Wallet Address:</Text> TX9f3uJkLmPqR8sD9AbC123456789XYZ
            </Text>
            <Text style={styles.listItem}>
              <Text style={styles.bold}>Memo / Tag:</Text> Not required
            </Text>
          </View>
          <Text style={styles.note}>
            Send the exact amount and upload your transaction screenshot.
          </Text>
        </View>
      );
    }

    if (method === "cash") {
      return (
        <View style={styles.container2}>
          <Text style={styles.title2}>💵 Cash Payment Instructions</Text>
          <Text style={styles.note}>
            Please contact our support team for cash payment arrangements.
          </Text>
        </View>
      );
    }

    if (method === "stripe") {
      return (
        <View style={styles.container2}>
          <Text style={styles.title2}>💳 Stripe Payment</Text>
          <Text style={styles.note}>
            Complete the payment using the Stripe checkout form. No additional details required.
          </Text>
        </View>
      );
    }

    if (method === "manual") {
      return (
        <View style={styles.container2}>
          <Text style={styles.title2}>📝 Manual Payment</Text>
          <Text style={styles.note}>
            Please contact our support team for manual payment processing instructions.
          </Text>
        </View>
      );
    }

    return null;
  };



  return (
    <ScrollView style={styles.container}>
      {/* <CurrentSubscription /> */}

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

          {/* Payment Method Selection */}
            <View style={styles.paymentMethodSection}>
              <Text style={styles.sectionTitle}>Select Payment Method</Text>

              <View style={styles.methodButtons}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === "bank_transfer" && styles.methodActive,
                  ]}
                  onPress={() => setPaymentMethod("bank_transfer")}
                >
                  <Text>Bank</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === "paypal" && styles.methodActive,
                  ]}
                  onPress={() => setPaymentMethod("paypal")}
                >
                  <Text>PayPal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === "crypto" && styles.methodActive,
                  ]}
                  onPress={() => setPaymentMethod("crypto")}
                >
                  <Text>Crypto</Text>
                </TouchableOpacity>
              </View>

              {/* Payment Preview */}
              <View style={styles.previewWrapper}>
                {paymentMethod === "bank_transfer" && (
                  <PaymentPreview
                    icon={bankIcon}
                    title="Bank Transfer"
                    subtitle="Complete the transfer and upload your receipt"
                  />
                )}

                {paymentMethod === "paypal" && (
                  <PaymentPreview
                    icon={paypalIcon}
                    title="PayPal"
                    subtitle="Secure PayPal payment (no receipt required)"
                  />
                )}

                {paymentMethod === "crypto" && (
                  <PaymentPreview
                    icon={cryptoIcon}
                    title="Cryptocurrency"
                    subtitle="Send crypto and upload transaction proof"
                  />
                )}
              </View>
              <PaymentInstructions method={paymentMethod} />
            </View>


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

      {/* <PaymentMethod plan={selectedPlan} /> */}
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

  
  paymentMethodSection: {
    marginTop: 24,
  },

  methodButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  methodButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
  },

  methodActive: {
    backgroundColor: "#e0e7ff",
    borderColor: "#2563eb",
  },

  previewWrapper: {
    marginTop: 12,
  },

  paymentPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
  },

  paymentLogo: {
    width: 48,
    height: 48,
    marginRight: 14,
  },

  paymentInfo: {
    flex: 1,
  },

  paymentTitle: {
    fontWeight: "700",
    fontSize: 16,
  },

  paymentSubtitle: {
    marginTop: 4,
    color: "#475569",
    fontSize: 13,
  },





  container2: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title2: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  list: {
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#1e293b',
  },
  note: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 18,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
});
