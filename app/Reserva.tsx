import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import styles from "@/constants/styles";
import { router, useGlobalSearchParams } from "expo-router";
import { Input } from "@/components/Input";
import Colors from "@/constants/Colors";
import { Button } from "@/components/Button";
import { criarReserva, selectSala } from "@/firebaseConfig";
import { Load } from "@/components/Load";

export default function Reserva() {
  const [nameReserva, setNameReserva] = React.useState("");
  const [nameReservaError, setNameReservaError] = React.useState("");
  const [selectedHorarios, setSelectedHorarios] = React.useState<string[]>([]); // Armazena os horários selecionados
  const params: any = useGlobalSearchParams();
  const selectedDate: Date = new Date(params.selectDate);
  const [horarioInicial, setHorarioInicial] = React.useState<any>();
  const [horarioFinal, setHorarioFinal] = React.useState<any>();

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

  function setTimeToDateWithOffset(dateString: string, timeString: string) {
    const date = new Date(dateString);

    const [hours, minutes] = timeString.split(":").map(Number);

    const adjustedHours = hours + 3;

    date.setUTCHours(adjustedHours, minutes, 0, 0);

    return date.toISOString();
  }

  async function handleReserva() {
    if (validateForm()) {
      // console.log(selectedHorarios);S
      let horaInicio: any = selectedHorarios[0].split(" - ")[0];
      const horaFinal =
        selectedHorarios[selectedHorarios.length - 1].split(" - ")[1];

      const dataInicio = setTimeToDateWithOffset(
        selectedDate.toISOString(),
        horaInicio,
      );
      const dataFinal = setTimeToDateWithOffset(
        selectedDate.toISOString(),
        horaFinal,
      );

      const returnReserva = await criarReserva(
        params.salaId,
        dataInicio,
        dataFinal,
        nameReserva,
      );

      if (returnReserva) {
        Alert.alert("Sua reserva foi feita com sucesso!!");
        router.push("/Home");
      } else {
        console.log("deu eerrado");
      }
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

  async function handleSelectSala() {
    const salaData = await selectSala(params.salaId);
    if (salaData) {
      let horaInicioNumber = salaData.horaDisp.horarioInicio;
      horaInicioNumber = horaInicioNumber.split(":")[0];
      let horaFinalNumber = salaData.horaDisp.horarioFinal;
      horaFinalNumber = horaFinalNumber.split(":")[0];
      setHorarioFinal(+horaFinalNumber);
      setHorarioInicial(+horaInicioNumber);
    }
  }

  React.useEffect(() => {
    handleSelectSala();
  }, []);

  const intervalos =
    horarioFinal && horarioInicial
      ? gerarIntervalos(horarioInicial, horarioFinal)
      : null;

  function isValidSelection(horario: string) {
    if (selectedHorarios.length === 0) {
      return true;
    }

    if (intervalos) {
      const index = intervalos.findIndex(
        (intervalo) => `${intervalo.inicio} - ${intervalo.fim} === horario`,
      );
      const allSelectedIndexes = selectedHorarios.map((selectedHorario) =>
        intervalos.findIndex(
          (intervalo) =>
            `${intervalo.inicio} - ${intervalo.fim} === selectedHorario`,
        ),
      );

      const minIndex = Math.min(...allSelectedIndexes);
      const maxIndex = Math.max(...allSelectedIndexes);

      return index === minIndex - 1 || index === maxIndex + 1;
    }
  }

  function toggleHorarioSelection(horario: string) {
    if (selectedHorarios.includes(horario)) {
      setSelectedHorarios((prev) => prev.filter((h) => h !== horario));
    } else if (isValidSelection(horario)) {
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
        {intervalos ? (
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
        ) : (
          <Load />
        )}

        <Button onPress={handleReserva} text="Reservar horários" />
      </View>
    </View>
  );
}
