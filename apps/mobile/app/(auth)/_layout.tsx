import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />   {/* Welcome screen */}
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}