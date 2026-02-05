import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import Welcome1 from "../../assets/images/Welcome1.png";
import Welcome2 from "../../assets/images/Welcome2.png";

const WelcomePage = ({ navigation }) => {
  const handleGetStarted = () => {
    router.push("/(auth)/login")
  };

  return (
    <View style={styles.container}>
      {/* Top Image */}
      
      { <Image
        source={Welcome1}
        style={styles.topImage}
      /> }

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>QR CARDIFY</Text>

        <Text style={styles.subtitle}>
          Generate your first Digital ID or{"\n"}Business Card
        </Text>

        <Text style={styles.description}>
          Create your digital profile and say goodbye to paper business cards.
          With our web and mobile app, you can design a personal or business
          profile, share it instantly through a QR code, and let others save
          your details with one scan. It’s a smarter, eco-friendly way to
          connect and manage your information securely.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Image */}
      { <Image
        source={Welcome2}
        style={styles.bottomImage}
      /> }
    </View>
  );
};

export default WelcomePage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E3E0F3", // secondary background
  },

  topImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.27,
    resizeMode: "cover",
    marginTop: 0,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 5,
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#547DAD", // primary
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#547DAD", // primary
    textAlign: "center",
    marginTop: 5,
    lineHeight: 24,
  },

  description: {
    fontSize: 14,
    color: "#2F3A4A", // neutral dark, softer than pure black
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 400,
  },

  button: {
    backgroundColor: "#547DAD", // primary
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginTop: 15,
    elevation: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  bottomImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2,
    resizeMode: "cover",
    marginTop: 0,
  },
});

