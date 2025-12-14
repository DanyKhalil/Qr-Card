import React, { useState, useEffect } from "react";
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
import { router } from "expo-router";
import { DEVELOPMENT_CONFIG } from '../../src/config/development';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const role = "user";
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            router.replace("/(tabs)/search");
          }
        } else {
          setChecking(false);
        }
      } catch (err) {
        setChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      setError("Please enter your full name");
      return false;
    }
    
    if (!email.trim()) {
      setError("Please enter your email");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!password.trim()) {
      setError("Please enter a password");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    
    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await axios.post(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });

      setMessage("Registration successful! Please verify your email and log in.");
      setError("");
      // Clear form fields
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Registration failed");
      setMessage("");
    }
  };

  const handleContinueWithoutAccount = () => {
    router.replace("/(tabs)/search");
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
              <View style={styles.tabBackgroundRight} />
              <View style={styles.tabInner}>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.tabInactive}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.tabActive}>Sign up</Text>
              </View>
            </View>

            <View style={styles.form}>
              {message ? (
                <Text style={[styles.message, styles.success]}>{message}</Text>
              ) : null}
              {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}

              {/* Name Input with Icon */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="person" 
                  size={20} 
                  color="#64A377" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>

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
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input with Icon */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="lock-closed" 
                  size={20} 
                  color="#64A377" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>Sign up</Text>
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

export default Registration;

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
  tabBackgroundRight: {
    position: "absolute",
    right: 0,
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
    marginRight: 20,
  },
  tabInactive: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7A8FB8",
    zIndex: 10,
    marginLeft: 35,
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
    marginBottom: 20,
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
  passwordToggle: {
    padding: 5,
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
    marginBottom: 10,
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

  /* Messages */
  message: {
    marginBottom: 15,
    textAlign: "center",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
  },
  success: {
    color: "#2F5F8F",
    backgroundColor: "#E3E0F3",
    borderColor: "#C9C5E8",
  },
  error: {
    color: "#7A2E2E",
    backgroundColor: "#F3E6E6",
    borderColor: "#E0B4B4",
  },
});
