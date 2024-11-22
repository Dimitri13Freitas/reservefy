import React from "react";
import { Text, View, Alert, Pressable } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { resetPassword } from "../firebaseConfig";
import { router } from "expo-router";

export default function ResetPassword() {
  const [email, setEmail] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [sendedResetPass, setSendedResetPass] = React.useState<boolean>(false);

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

    return isValid;
  }

  async function handlePress() {
    if (validateForm()) {
      const returnResetPass = await resetPassword(email);
      if (returnResetPass) {
        setSendedResetPass(true);
      }
    } else {
      console.log("não é valido");
    }
  }

  return (
    <View style={[styles.screenContainer, { width: "100%" }]}>
      <View style={{ marginTop: 60, position: "relative" }}>
        {sendedResetPass ? (
          <View>
            <Text>
              Se o preenchido estiver cadastrado, você receberá um email. Pode
              demorar até 10 minutos. Caso não receba, entre em contato.
            </Text>
            <Button text="Voltar ao inicio" onPress={() => router.push("/")} />
          </View>
        ) : (
          <View>
            <Input
              value={email}
              onChangeText={(e) => setEmail(e)}
              err={emailError ? true : false}
              type="email"
              label="Email:"
              placeholder="Digite seu email"
            />
            <Text style={styles.textError}>
              {emailError ? emailError : null}
            </Text>
            <Button onPress={handlePress} text="Redefinir senha" />
          </View>
        )}

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
    </View>
  );
}
