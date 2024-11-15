import React from "react";
import { Text, View, Alert, Pressable } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { logIn } from "../firebaseConfig";
import { router } from "expo-router";

export default function SignIn() {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  function validateForm() {
    let isValid = true;

    if (!email) {
      setEmailError("O email é obrigatório.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("O email está inválido.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("A senha é obrigatória.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  }

  async function handleLogin() {
    if (validateForm()) {
      const returnUser = await logIn(email, password);
      if (returnUser.code) {
        Alert.alert("Seu email ou senha estão incorretos.", "", [
          { text: "OK" },
        ]);
      } else {
        router.push("/Home");
      }
    }
  }

  return (
    <View style={[styles.screenContainer, { width: "100%" }]}>
      <View style={{ width: "100%" }}>
        <LottieView
          style={{
            marginTop: 100,
            width: 230,
            height: 88,
          }}
          source={require("../assets/staticLogo.json")}
          loop={false}
        />
        <Text style={[styles.textLightColor, { fontSize: 20 }]}>
          Bem-vindo de volta.
        </Text>
        <Input
          value={email}
          onChangeText={(e) => setEmail(e)}
          err={emailError ? true : false}
          type="email"
          label="Email:"
          placeholder="Digite seu email"
        />
        <Text style={styles.textError}>{emailError ? emailError : null}</Text>
        <Input
          value={password}
          onChangeText={(e) => setPassword(e)}
          err={passwordError ? true : false}
          type="password"
          label="Senha:"
          placeholder="•••••••••"
        />
        <Text style={styles.textError}>
          {passwordError ? passwordError : null}
        </Text>

        <Pressable onPress={() => router.push("/ResetPassword")}>
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
        <Button text="Entrar" onPress={handleLogin} />
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
