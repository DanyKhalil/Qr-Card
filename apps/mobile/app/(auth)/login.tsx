import React, { useState, useEffect } from "react";
import { DEVELOPMENT_CONFIG } from '../../src/config/development';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setChecking(false); // simulate auth check
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/auth/login`, {
        email,
        password,
      });

      // Save token and user in AsyncStorage (like localStorage on web)
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      // const token = await AsyncStorage.getItem("token");
      // const user = JSON.parse(await AsyncStorage.getItem("user"));
      // console.log(token)
      // console.log(user)

      // Navigate based on user role
      if (res.data.user.role === "admin") {
        router.replace("/(tabs)/admin");
      } else {
        router.replace("/(tabs)/search");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
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
      {/* TABS */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBackground} />

        <View style={styles.tabInner}>
          <Text style={styles.tabActive}>Login</Text>

          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.tabInactive}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

/* ─────────────────────────────────────────── */
/*                    STYLES                   */
/* ─────────────────────────────────────────── */

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

  tabBackground: {
    position: "absolute",
    left: 0,
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
    paddingLeft: 28,
  },

  tabInactive: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "700",
    color: "#4C8F66",
    zIndex: 10,
    marginRight: 30,
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

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
