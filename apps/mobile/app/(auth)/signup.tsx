import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { DEVELOPMENT_CONFIG } from '../../src/config/development';

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "user";
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setChecking(false); // simulate auth check
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });

      // Registration success: prompt user to verify email and login
      setMessage("Registration successful! Please verify your email and log in.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Registration failed");
      setMessage("");
    }
  };

  if (checking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#64A377" />
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  tabContainer: {
    width: 300,
    height: 55,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#9BD4A9",
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
    backgroundColor: "#CFEFD8",
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
    textAlign: "left",
    fontSize: 20,
    fontWeight: "700",
    color: "#4C8F66",
    zIndex: 10,
    marginRight: 20,
  },

  tabInactive: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "700",
    color: "#4C8F66",
    zIndex: 10,
    marginLeft: 35,
  },

  form: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },

  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#FF8E57",
    borderRadius: 10,
    marginBottom: 25,
    paddingLeft: 15,
    fontSize: 16,
  },

  primaryButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#64A377",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
  },

  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  message: {
    marginBottom: 10,
    textAlign: "center",
  },

  success: {
    color: "green",
  },

  error: {
    color: "red",
  },
});
