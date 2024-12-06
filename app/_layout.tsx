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
      <Stack.Screen name="SignUp" options={{ title: "Cadastro" }} />
      <Stack.Screen options={{ headerShown: false }} name="SignIn" />
      <Stack.Screen
        name="ResetPassword"
        options={{ title: "Redefinir Senha" }}
      />
      <Stack.Screen
        name="setPassword"
        options={{ title: "Criar Nova Senha" }}
      />
      <Stack.Screen options={{ headerShown: false }} name="Home" />
      <Stack.Screen name="Menu" />
      <Stack.Screen name="AddMember" options={{ title: "Adicionar Membro" }} />
      <Stack.Screen name="AddSala" options={{ title: "Adicionar Sala" }} />
      <Stack.Screen name="ListaSalas" options={{ title: "Salas" }} />
      <Stack.Screen name="Reserva" options={{ title: "Reserva de sala" }} />
      <Stack.Screen
        name="GerenciaUsers"
        options={{ title: "Gerenciar Membros" }}
      />
    </Stack>
  );
}
