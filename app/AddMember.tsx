import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import styles from "../constants/styles";
import { router } from "expo-router";
import { createUser } from "../firebaseConfig";
import { Input } from "@/components/Input";
import Checkbox from "expo-checkbox";
import { Button } from "@/components/Button";
import Colors from "@/constants/Colors";
import { Load } from "@/components/Load";

export default function AddMember() {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [load, setLoad] = React.useState<boolean>(false);
  const [isChecked, setChecked] = React.useState(false);

  const [nameError, setNameError] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

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
      const returnUser = await createUser(
        email,
        password,
        name,
        ["common"],
        isChecked,
      );
      if (returnUser.displayName) {
        Alert.alert(
          "Membro Adicionado com sucesso!!",
          "Deseja adicionar mais?",
          [{ text: "Não", onPress: () => router.push("..") }, { text: "Sim" }],
        );
        setName("");
        setEmail("");
        setPassword("");
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
    <View
      style={[
        styles.screenContainer,
        { width: "100%" },
        load
          ? {
              alignItems: "center",
              justifyContent: "center",
            }
          : null,
      ]}
    >
      {load ? (
        <Load />
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
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 10,
            }}
          >
            <Checkbox
              color={Colors.primary.main}
              value={isChecked}
              onValueChange={setChecked}
            />
            <Text
              style={{ maxWidth: 250 }}
              onPress={() => setChecked(!isChecked)}
            >
              Exigir que este usuário altere a senha quando entrar pela primeira
              vez?
            </Text>
          </View>
          <Button onPress={handlePress} text="Adicionar Membro" />
        </View>
      )}
    </View>
  );
}
