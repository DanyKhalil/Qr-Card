import React, { useState, useEffect } from "react";
import { DEVELOPMENT_CONFIG } from '../../src/config/development';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userString = await AsyncStorage.getItem("user");
        
        if (token && userString) {
          const user = JSON.parse(userString);
          
          if (user.role === "admin") {
            router.replace("/(tabs)/profile");
          } else {
            router.replace("/(tabs)/profile");
          }
        } else {
          setChecking(false);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      const res = await axios.post(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/auth/login`, {
        email,
        password,
      });

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate based on user role
      if (res.data.user.role === "admin") {
        router.replace("/(tabs)/profile");
      } else {
        router.replace("/(tabs)/profile");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  const handleContinueWithoutAccount = () => {
    // Navigate to the same page as if logged in, but without setting auth tokens
    router.replace("/(tabs)/search");
  };

  const handleSubmitEditing = () => {
    handleLogin();
  };

  if (checking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#64A377" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Image */}
        <View style={styles.topImageContainer}>
          <Image
            source={require('../../assets/images/LoginTop.png')}
            style={styles.topImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.centerWrapper}>
          <View style={styles.centerContent}>
            <View style={styles.tabContainer}>
              <View style={styles.tabBackground} />

              <View style={styles.tabInner}>
                <Text style={styles.tabActive}>Login</Text>

                <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                  <Text style={styles.tabInactive}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.form}>
              {error ? <Text style={styles.error}>{error}</Text> : null}

              {/* Email Input with Icon */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="mail" 
                  size={20} 
                  color="#64A377" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              {/* Password Input with Icon */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="lock-closed" 
                  size={20} 
                  color="#64A377" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmitEditing}
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                <Text style={styles.primaryButtonText}>Login</Text>
              </TouchableOpacity>

              {/* Continue without account button */}
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={handleContinueWithoutAccount}
              >
                <Text style={styles.secondaryButtonText}>Continue without account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Image */}
        <View style={styles.bottomImageContainer}>
          <Image
            source={require('../../assets/images/LoginBottom.png')}
            style={styles.bottomImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    color: "#547DAD",
    fontSize: 16,
  },
  topImageContainer: {
    width: "100%",
    height: 180,
  },
  topImage: {
    width: "100%",
    height: "100%",
  },
  bottomImageContainer: {
    width: "100%",
    height: 150,
    marginTop: 20,
  },
  bottomImage: {
    width: "100%",
    height: "100%",
  },
  centerWrapper: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },

  /* Tabs */
  tabContainer: {
    width: 300,
    height: 55,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#547DAD",
    justifyContent: "center",
    marginBottom: 40,
    position: "relative",
    overflow: "hidden",
  },
  tabBackground: {
    position: "absolute",
    left: 0,
    width: "50%",
    height: "100%",
    backgroundColor: "#E3E0F3",
    borderRadius: 50,
  },
  tabInner: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  tabActive: {
    fontSize: 20,
    fontWeight: "700",
    color: "#547DAD",
    zIndex: 10,
    paddingLeft: 28,
  },
  tabInactive: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7A8FB8",
    zIndex: 10,
    marginRight: 30,
  },

  /* Form */
  form: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#547DAD",
    borderRadius: 10,
    marginBottom: 25,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
    width: 25,
    color: "#547DAD",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2F3A4A",
    paddingVertical: 12,
  },

  /* Buttons */
  primaryButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#547DAD",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#547DAD",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButtonText: {
    color: "#547DAD",
    fontWeight: "bold",
    fontSize: 16,
  },

  /* Error */
  error: {
    color: "#7A2E2E",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
    width: "100%",
    padding: 12,
    backgroundColor: "#F3E6E6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0B4B4",
  },
});
