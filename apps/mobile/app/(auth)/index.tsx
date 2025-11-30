import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome</Text>

      <Button 
        title="Login" 
        onPress={() => router.push("/(auth)/login")} 
      />

      <Button 
        title="Sign Up" 
        onPress={() => router.push("/(auth)/signup")} 
      />
    </View>
  );
}
