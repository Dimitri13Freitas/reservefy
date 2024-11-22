import React from "react";
import { Text, View, Alert, Pressable, ActivityIndicator } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { logIn, selectPerfil } from "../firebaseConfig";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import { Load } from "@/components/Load";

export default function SignIn() {
  const [email, setEmail] = React.useState<string>("demetrio@gmail.com");
  const [password, setPassword] = React.useState<string>("987654321");

  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  const [load, setLoad] = React.useState<boolean>(false);

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
    setLoad(true);
    try {
      if (validateForm()) {
        const returnUser = await logIn(email, password);
        if (returnUser.code) {
          Alert.alert("Seu email ou senha estão incorretos.", "", [
            { text: "OK" },
          ]);
        } else {
          const groupId: string | null = await AsyncStorage.getItem("groupId");
          console.log(groupId);
          if (groupId) {
            const teste = await selectPerfil(groupId, returnUser.uid);
            if (teste.provPassword) {
              router.push("/setPassword");
            } else {
              router.push("/Home");
            }
          }
        }
      }
      setLoad(false);
    } catch (err) {
      console.log(err);
    }
  }

  const ContentScreen = () => {
    // return (
    // );
  };

  return (
    <View
      style={[
        styles.screenContainer,
        { width: "100%" },
        load ? { alignItems: "center", justifyContent: "center" } : null,
      ]}
    >
      {load ? (
        <Load />
      ) : (
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
      )}
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
