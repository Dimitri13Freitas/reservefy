import { Stack } from "expo-router";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "[Reanimated] Reduced motion setting is enabled on this device.",
]);

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
        headerTransparent: true,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} name="index" />
      <Stack.Screen name="SignUp" />
      <Stack.Screen options={{ headerShown: false }} name="SignIn" />
      <Stack.Screen name="ResetPassword" />
      <Stack.Screen name="setPassword" />
      <Stack.Screen options={{ headerShown: false }} name="Home" />
      <Stack.Screen name="Menu" />
      <Stack.Screen name="AddMember" />
      <Stack.Screen name="AddSala" />
    </Stack>
  );
}
