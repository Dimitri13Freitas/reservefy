import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "@/constants/styles";
import { useGlobalSearchParams } from "expo-router";
import { Input } from "@/components/Input";
import Colors from "@/constants/Colors";
import { Button } from "@/components/Button";
import { criarReserva } from "@/firebaseConfig";

export default function Reserva() {
  const [nameReserva, setNameReserva] = React.useState("");
  const [nameReservaError, setNameReservaError] = React.useState("");
  const [selectedHorarios, setSelectedHorarios] = React.useState<string[]>([]); // Armazena os horários selecionados
  const params: any = useGlobalSearchParams();
  const selectedDate: Date = new Date(params.selectDate);

  function validateForm() {
    let isValid = true;

    if (!nameReserva) {
      setNameReservaError("Preencha o campo nome!");
      isValid = false;
    } else {
      setNameReservaError("");
    }

    if (selectedHorarios.length === 0) {
      alert("Por favor, selecione pelo menos um horário para a reserva.");
      isValid = false;
    }

    return isValid;
  }

  async function handleReserva() {
    if (validateForm()) {
      const teste = selectedDate;
      console.log(selectedHorarios);
      console.log(teste.replace("00:00", "seila"));
      // const returnReserva = await criarReserva(params.salaId, )

      // console.log("Reserva efetuada:");
      // console.log("Nome da reserva:", nameReserva);
      // console.log("Horários selecionados:", selectedHorarios);
      // console.log("Data:", selectedDate);
    }
  }

  function gerarIntervalos(horaInicio: number, horaFinal: number) {
    const horariosDisponiveis = [];

    for (let hora = horaInicio; hora < horaFinal; hora++) {
      const inicio = `${hora.toString().padStart(2, "0")}:00`;
      const fim = `${(hora + 1).toString().padStart(2, "0")}:00`;
      horariosDisponiveis.push({ inicio, fim });
    }

    return horariosDisponiveis;
  }

  const intervalos = gerarIntervalos(9, 18);

  function isValidSelection(horario: string) {
    if (selectedHorarios.length === 0) {
      return true;
    }

    const index = intervalos.findIndex(
      (intervalo) => `${intervalo.inicio} - ${intervalo.fim}` === horario,
    );
    const allSelectedIndexes = selectedHorarios.map((selectedHorario) =>
      intervalos.findIndex(
        (intervalo) =>
          `${intervalo.inicio} - ${intervalo.fim}` === selectedHorario,
      ),
    );

    const minIndex = Math.min(...allSelectedIndexes); // Menor índice selecionado
    const maxIndex = Math.max(...allSelectedIndexes); // Maior índice selecionado

    // Permitir seleção apenas se o índice for consecutivo a algum extremo (minIndex ou maxIndex)
    return index === minIndex - 1 || index === maxIndex + 1;
  }

  function toggleHorarioSelection(horario: string) {
    if (selectedHorarios.includes(horario)) {
      // Remove o horário se ele já estiver selecionado
      setSelectedHorarios((prev) => prev.filter((h) => h !== horario));
    } else if (isValidSelection(horario)) {
      // Adiciona o horário somente se for uma seleção válida
      setSelectedHorarios((prev) => [...prev, horario]);
    } else {
      alert(
        "Por favor, selecione um horário consecutivo ao último selecionado.",
      );
    }
  }

  return (
    <View style={[styles.screenContainer, { width: "100%" }]}>
      <View style={{ marginTop: 40, position: "relative" }}>
        <Input
          type="text"
          value={nameReserva}
          label="Nome da reunião:"
          err={!!nameReservaError}
          placeholder="Digite o nome da reunião"
          onChangeText={(e) => setNameReserva(e)}
        />
        <Text style={styles.textError}>
          {nameReservaError ? nameReservaError : null}
        </Text>
        <Text style={[styles.textLightColor, { fontSize: 16 }]}>
          Data Escolhida:
        </Text>
        <Text
          style={{
            padding: 14,
            fontSize: 14,
            backgroundColor: Colors.opacityPrymary(0.2),
            borderRadius: 8,
          }}
        >
          {selectedDate.toLocaleDateString()}
        </Text>
        <Text style={{ marginTop: 20, marginBottom: 8, fontSize: 16 }}>
          Escolha os Horários:
        </Text>
        <ScrollView style={{ height: 300 }}>
          {intervalos.map((intervalo, index) => {
            const horarioLabel = `${intervalo.inicio} - ${intervalo.fim}`;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => toggleHorarioSelection(horarioLabel)}
                style={{
                  padding: 10,
                  backgroundColor: selectedHorarios.includes(horarioLabel)
                    ? Colors.primary.main
                    : Colors.white.light,
                  // color: Colors.secundary.main,
                  marginBottom: 5,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: selectedHorarios.includes(horarioLabel)
                      ? Colors.white.light
                      : Colors.secundary.main,
                  }}
                >
                  {horarioLabel.replace("-", "-----")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <Button onPress={handleReserva} text="Reservar horários" />
      </View>
    </View>
  );
}
