import React from "react";
import { Text, View, Alert, Pressable } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { auth, updateProvPassword, User } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function setPassword() {
  const [accPass, setAccPass] = React.useState<string>("");
  const [newPass, setNewPass] = React.useState<string>("");
  const [confirmedNewPass, setConfirmedNewPass] = React.useState<string>("");

  const [errorNewPass, setErrorNewPass] = React.useState<string>("");
  const [errorConfirmedNewPass, setErrorConfirmedNewPass] =
    React.useState<string>("");

  function validateForm() {
    let isValid = true;

    if (!newPass) {
      setErrorNewPass("Este campo é obrigatório.");
      isValid = false;
    } else if (!confirmedNewPass) {
      setErrorNewPass("Este campo é obrigatório.");
      isValid = false;
    } else if (newPass.length < 8) {
      setErrorNewPass("Este campo é obrigatório.");
      isValid = false;
    } else if (newPass != confirmedNewPass) {
      setErrorNewPass("As senhas não conferem.");
      setErrorConfirmedNewPass("As senhas não conferem.");
      isValid = false;
    } else {
      setErrorNewPass("");
    }

    return isValid;
  }

  async function handlePress() {
    if (validateForm()) {
      const user: User | null = auth.currentUser;
      const groupId = await AsyncStorage.getItem("groupId");

      if (user && groupId) {
        const returnUpdatePass = await updateProvPassword(
          groupId,
          user,
          newPass,
        );
        if (returnUpdatePass) {
          Alert.alert("Senha Atualizada com sucesso!!", "", [
            { text: "Continuar", onPress: () => router.push("/Home") },
          ]);
        }
      } else {
        console.log("erro Front");
      }
    } else {
      console.log("não é valido");
    }
  }

  return (
    <View style={[styles.screenContainer, { width: "100%" }]}>
      <View style={{ marginTop: 60, position: "relative" }}>
        <View>
          <Text>
            Esta foi uma senha provisória que seu Administrador criou. Abaixo
            você pode criar sua própria senha.
          </Text>
          <Input
            value={newPass}
            onChangeText={(e) => setNewPass(e)}
            err={errorNewPass ? true : false}
            type="password"
            label="Digite a sua nova senha:"
            placeholder="Digite a senha"
          />
          <Text style={styles.textError}>
            {errorNewPass ? errorNewPass : null}
          </Text>
          <Input
            value={confirmedNewPass}
            onChangeText={(e) => setConfirmedNewPass(e)}
            err={errorConfirmedNewPass ? true : false}
            type="password"
            label="Confirme a senha:"
            placeholder="Digite a novamente a senha"
          />
          <Text style={styles.textError}>
            {errorConfirmedNewPass ? errorConfirmedNewPass : null}
          </Text>
          <Button onPress={handlePress} text="Redefinir senha" />
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
    </View>
  );
}
