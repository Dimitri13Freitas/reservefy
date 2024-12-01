import styles from "@/constants/styles";
import React from "react";
import { View, Text, Alert } from "react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import { Load } from "@/components/Load";
import { createSala } from "../firebaseConfig";
import { router } from "expo-router";

export default function AddSala() {
  const [nameRoom, setNameRoom] = React.useState<string>("");
  const [nameRoomError, setNameRoomError] = React.useState<string>("");
  const [load, setLoad] = React.useState<boolean>(false);

  const [firstSelectedHour, setFirstSelectedHour] = React.useState<string>("");
  const [firstSelectedHourError, setFirstSelectedHourError] =
    React.useState<string>("");
  const [secondSelectedHour, setSecondSelectedHour] =
    React.useState<string>("");
  const [secondSelectedHourError, setSecondSelectedHourError] =
    React.useState<string>("");

  function validateForm() {
    let isValid = true;

    if (!nameRoom) {
      setNameRoomError("Preencha o campo nome!");
      isValid = false;
    } else {
      setNameRoomError("");
    }

    if (!firstSelectedHour) {
      setFirstSelectedHourError("Preencha este campo!");
    } else {
      setFirstSelectedHourError("");
    }

    if (!secondSelectedHour) {
      setSecondSelectedHourError("Preencha este campo!");
    } else {
      setSecondSelectedHourError("");
    }

    return isValid;
  }

  async function handlePress() {
    if (validateForm()) {
      setLoad(true);
      const returnCreateSala = await createSala(
        nameRoom,
        firstSelectedHour,
        secondSelectedHour,
      );
      if (returnCreateSala) {
        console.log("msg Front: deu bom");
        Alert.alert("Sala Adicionada com sucesso!!", "Deseja adicionar mais?", [
          { text: "Não", onPress: () => router.push("..") },
          { text: "Sim" },
        ]);
        setNameRoom("");
        setFirstSelectedHour("");
        setSecondSelectedHour("");
        setLoad(false);
      }
    }
  }

  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00"; // Formata com dois dígitos
      hours.push(hour);
    }
    return hours;
  };
  const hours = generateHours();

  return (
    <View
      style={[
        styles.screenContainer,
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
            value={nameRoom}
            label="Nome da Sala:"
            err={nameRoomError ? true : false}
            placeholder="Digite o nome da Sala"
            onChangeText={(e) => setNameRoom(e)}
          />
          <Text style={styles.textError}>
            {nameRoomError ? nameRoomError : null}
          </Text>
          <Text style={{ fontSize: 16 }}>Horario de início:</Text>

          <Picker
            style={[styles.picker]}
            selectedValue={firstSelectedHour}
            onValueChange={(itemValue) => setFirstSelectedHour(itemValue)}
          >
            <Picker.Item
              color="gray"
              label="Escolha o horário de inicio"
              enabled={false}
              value={null}
            />
            {hours.map((hour) => (
              <Picker.Item
                key={hour}
                label={hour}
                value={hour}
                color={secondSelectedHour === hour ? "gray" : "black"}
                enabled={secondSelectedHour !== hour}
              />
            ))}
          </Picker>
          <Text style={styles.textError}>
            {firstSelectedHourError ? firstSelectedHourError : null}
          </Text>
          <Text style={{ fontSize: 16 }}>Horario de final:</Text>
          <Picker
            style={styles.picker}
            selectedValue={secondSelectedHour}
            onValueChange={(itemValue) => setSecondSelectedHour(itemValue)}
          >
            <Picker.Item
              color="gray"
              label="Escolha o horário de final"
              enabled={false}
              value={null}
            />
            {hours.map((hour) => (
              <Picker.Item
                key={hour}
                label={hour}
                value={hour}
                color={firstSelectedHour === hour ? "gray" : "black"}
                enabled={firstSelectedHour !== hour}
              />
            ))}
          </Picker>
          <Text style={styles.textError}>
            {secondSelectedHourError ? secondSelectedHourError : null}
          </Text>

          <Button onPress={handlePress} text="Adicionar Sala" />
        </View>
      )}
    </View>
  );
}
