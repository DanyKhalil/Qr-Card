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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "space-between",
    alignItems: "center",
  },

  topImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.27, // adjust based on image ratio
    resizeMode: "cover",
    marginTop: 0,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 5,
    alignItems: "center",
  },

  title: {
    fontSize: 32, // smaller than before
    fontWeight: "700",
    color: "#3a9a60",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18, // smaller
    fontWeight: "500",
    color: "#3a9a60",
    textAlign: "center",
    marginTop: 5,
    lineHeight: 24, // reduced
  },

  description: {
    fontSize: 14, // smaller
    color: "#333",
    textAlign: "center",
    lineHeight: 20, // reduced
    marginTop: 10, // reduced spacing
    maxWidth: 400,
  },

  button: {
    backgroundColor: "#3a9a60",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginTop: 15,
    elevation: 4,
  },

  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  bottomImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2, // adjust based on image ratio
    resizeMode: "cover",
    marginTop: 0,
  },
});
