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

const WelcomePage = ({ navigation }) => {
  const handleGetStarted = () => {
    router.push("/(auth)/login")
  };

  return (
    <View style={styles.container}>
      {/* Top Image */}
      
      {/* <Image
        source={require("../assets/images/icons/TopRightImage.png")}
        style={styles.topImage}
      /> */}

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>QR CARD</Text>

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
      {/* <Image
        source={require("../assets/images/icons/WelcomeBackground.png")}
        style={styles.bottomImage}
      /> */}
    </View>
  );
};

export default WelcomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
  },

  topImage: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    marginTop: 20,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 10,
    alignItems: "center",
  },

  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#3a9a60",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 22,
    fontWeight: "500",
    color: "#3a9a60",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 30,
  },

  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 20,
    maxWidth: 500,
  },

  button: {
    backgroundColor: "#3a9a60",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 25,
    elevation: 4,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  bottomImage: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: -10,
  },
});
