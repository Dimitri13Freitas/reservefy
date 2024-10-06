import { Text, View, ImageBackground, Pressable } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { router } from "expo-router";

export default function SignIn() {
  return (
    <View style={[styles.screenContainer, { width: "100%" }]}>
      <View style={{ width: "100%" }}>
        <LottieView
          style={{
            marginTop: 120,
            width: 230,
            height: 88,
          }}
          source={require("../assets/staticLogo.json")}
          loop={false}
          autoPlay
        />
        <Text style={[styles.textLightColor, { fontSize: 20 }]}>
          Bem-vindo de volta.
        </Text>
        <Input type="email" label="Email:" placeholder="Digite seu email" />
        <Input type="password" label="Senha:" placeholder="•••••••••" />
        <Pressable>
          <Text
            style={[
              styles.simpleLink,
              { textAlign: "right" },
              styles.textLightColor,
            ]}
          >
            Esqueceu a senha?
          </Text>
        </Pressable>
        <Button text="Entrar" />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            style={[
              { textAlign: "center", fontSize: 16, marginTop: 16 },
              styles.textDarkColor,
            ]}
          >
            Ainda não possui conta?
          </Text>
          <Pressable onPress={() => router.push("/SignUp")}>
            <Text style={[styles.simpleLink, styles.textLightColor]}>
              Cadastre-se aqui
            </Text>
          </Pressable>
        </View>
      </View>
      <LottieView
        style={{
          width: 530,
          height: 530,
          position: "absolute",
          top: -10,
          right: -280,
          zIndex: -2,
        }}
        source={require("../assets/circulo5.json")}
        loop={false}
        autoPlay
      />
      <LottieView
        style={{
          width: 530,
          height: 530,
          position: "absolute",
          bottom: -250,
          left: -290,
          zIndex: -2,
        }}
        source={require("../assets/circulo3.json")}
        loop={false}
        autoPlay
      />
    </View>
  );
}
