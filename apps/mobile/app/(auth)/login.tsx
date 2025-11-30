import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const handleLogin = () => {
    // After login → go to app tabs
    router.replace("/(tabs)/search");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
