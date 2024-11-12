import React from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { router } from "expo-router";
import { createUser } from "../firebaseConfig";
import Colors from "@/constants/Colors";

export default function SignUp() {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = React.useState<string>("");
  const [load, setLoad] = React.useState<boolean>(false);

  const [nameError, setNameError] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");
  // const [passwordError, setPasswordError] = React.useState<string>("");

  function validateForm() {
    let isValid = true;

    if (!name) {
      setNameError("Preencha o campo nome");
      isValid = false;
    } else {
      setNameError("");
    }

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
    } else if (password !== confirmedPassword) {
      setPasswordError("As senhas não conferem.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  }

  async function handlePress() {
    if (validateForm()) {
      setLoad(true);
      const returnUser = await createUser(email, password, name, ["admin"]);
      if (returnUser.displayName) {
        Alert.alert(
          "Parabéns, sua conta foi criada com sucesso!!",
          "Ir para a tela de login?",
          [
            { text: "Não" },
            { text: "Sim", onPress: () => router.push("/SignIn") },
          ],
        );
        setName("");
        setEmail("");
        setPassword("");
        setConfirmedPassword("");
      } else {
        console.log(returnUser.code);
        if (returnUser.code.includes("email-already-in-use")) {
          Alert.alert("Este email já possui cadastro", "Tentar novamente?", [
            { text: "Sim" },
            { text: "Não", onPress: () => router.push("/SignIn") },
          ]);
        }
      }
      setLoad(false);
    }
  }

  return (
    <View style={[styles.screenContainer, { width: "100%" }]}>
      {load ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      ) : (
        <View style={{ marginTop: 60, position: "relative" }}>
          <Input
            type="text"
            value={name}
            label="Nome do usuário:"
            err={nameError ? true : false}
            placeholder="Digite seu nome"
            onChangeText={(e) => setName(e)}
          />
          <Text style={styles.textError}>{nameError ? nameError : null}</Text>
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
            err={passwordError ? true : false}
            value={password}
            onChangeText={(e) => setPassword(e)}
            type="password"
            label="Senha:"
            placeholder="Digite sua senha"
          />
          <Text style={styles.textError}>
            {passwordError ? passwordError : null}
          </Text>

          <Input
            err={passwordError ? true : false}
            value={confirmedPassword}
            onChangeText={(e) => setConfirmedPassword(e)}
            type="password"
            label="Confirme a senha:"
            placeholder="Digite sua senha novamente"
          />
          <Button onPress={handlePress} text="Cadastrar" />
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
              top: -470,
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
      )}
    </View>
  );
}
