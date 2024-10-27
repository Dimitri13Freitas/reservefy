import { Stack } from "expo-router";

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
