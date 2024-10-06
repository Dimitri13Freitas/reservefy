import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { router } from "expo-router";

export default function SignUp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <View style={[styles.screenContainer, { width: "100%" }]}>
      <View style={{ marginTop: 130, position: "relative" }}>
        <Input
          type="text"
          label="Nome do usuário:"
          placeholder="Digite seu nome"
        />
        <Input type="email" label="Email:" placeholder="Digite seu email" />
        <Input type="password" label="Senha:" placeholder="Digite sua senha" />
        <Input
          type="password"
          label="Confirme a senha:"
          placeholder="Digite sua senha novamente"
        />
        <Button text="Cadastrar" />
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
            Já possui uma conta?
          </Text>
          <Pressable onPress={() => router.push("/")}>
            <Text style={[styles.simpleLink, styles.textLightColor]}>
              Entrar
            </Text>
          </Pressable>
        </View>
        <LottieView
          style={{
            width: 530,
            height: 530,
            position: "absolute",
            top: -530,
            right: -300,
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
            bottom: -550,
            left: -290,
            zIndex: -2,
          }}
          source={require("../assets/circulo3.json")}
          loop={false}
          autoPlay
        />
      </View>
    </View>
  );
}
