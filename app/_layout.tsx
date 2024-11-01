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
      <Stack.Screen name="SignIn" />
      <Stack.Screen options={{ headerShown: false }} name="Home" />
    </Stack>
  );
}
