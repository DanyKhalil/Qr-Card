import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions
} from "react-native";
import QRCode from "react-native-qrcode-svg";

// For local images, you'll need to import them properly
// If using require, you can do it like this:
import neoImage from "../../../../assets/images/neo.jpg";
import omtImage from "../../../../assets/images/omt.png"
import whishImage from "../../../../assets/images/whish.jpg"

// If using Expo, you might use:
// import neoImage from "../../../assets/images/logos/neo.jfif";
// import omtImage from "../../../assets/images/logos/omt.png";
// import whishImage from "../../../assets/images/logos/whish.jpg";

const PaymentMethod = ({ plan }) => {
  const qrSize = 200;

  // Array of payment methods
  const paymentMethods = [
    {
      id: "whish",
      name: "Whish Money",
      logo: whishImage,
      qrValue: "https://whish.money/pay/OG8JdkS2J",
      description: "Pay via Whish"
    },
    {
      id: "omt",
      name: "OMT Pay",
      logo: omtImage,
      qrValue: "5eVHQMFnR4o2YOdO/wF/jCNcsYqlvj0iPvR63uKo2pPBy4ePUnEMxozWI4wKrDPtAS/+SCrX5oTP\nvIvO57QXSD4HvgjmmlGS82x4kaQG5us=",
      description: "Pay via OMT"
    },
    {
      id: "neo",
      name: "Neo Bank Audi",
      logo: neoImage,
      qrValue: '{"accountNumber":"501233060002","iban":"LB98005699840103501233060002","amount":"1.00","currency":"USD"}',
      description: "Pay via Neo"
    }
  ];

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.wrapper}>
        {/* <Text style={styles.title}>Payment for {plan?.name}</Text> */}
        <View style={styles.container}>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <Image 
                source={method.logo} 
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.qrContainer}>
                <QRCode 
                  value={method.qrValue}
                  size={qrSize}
                  backgroundColor="#ffffff"
                  color="#000000"
                />
              </View>
              <Text style={styles.description}>{method.description}</Text>
              {/* <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Pay Now</Text>
              </TouchableOpacity> */}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.9, 500);

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  wrapper: {
    alignItems: "center",
    gap: 20,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2A3550",
    marginBottom: 16,
    textAlign: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  paymentCard: {
    alignItems: "center",
    padding: 20,
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: "#caddf3",
    width: CARD_WIDTH,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 10,
  },
  qrContainer: {
    marginBottom: 15,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 15,
    textAlign: "center",
  },
  payButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default PaymentMethod;