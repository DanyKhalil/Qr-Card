import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function SignupScreen() {
  const handleSignup = () => {
    // After signup → go to app tabs
    router.replace("/(tabs)/search");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Create Account</Text>

      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}
