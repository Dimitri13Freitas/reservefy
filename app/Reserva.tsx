import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import styles from "@/constants/styles";
import { router, useGlobalSearchParams } from "expo-router";
import { Input } from "@/components/Input";
import Colors from "@/constants/Colors";
import { Button } from "@/components/Button";
import {
  criarReserva,
  selectSala,
  getReservasParaData,
} from "@/firebaseConfig";
import { Load } from "@/components/Load";

export default function Reserva() {
  const [nameReserva, setNameReserva] = React.useState("");
  const [nameReservaError, setNameReservaError] = React.useState("");
  const [selectedHorarios, setSelectedHorarios] = React.useState<string[]>([]); // Armazena os horários selecionados
  const params: any = useGlobalSearchParams();
  const selectedDate: Date = new Date(params.selectDate);
  const [horarioInicial, setHorarioInicial] = React.useState<any>();
  const [horarioFinal, setHorarioFinal] = React.useState<any>();
  const [reservas, setReservas] = React.useState<any>();
  const [intervalos, setIntervalos] = React.useState<any>();
  const [load, setLoad] = React.useState<boolean>(false);

  React.useEffect(() => {
    handleSelectSala();
    if (horarioFinal && horarioInicial) {
      setIntervalos(() => gerarIntervalos(horarioInicial, horarioFinal));
    } else {
      console.log("deum ruim");
    }
  }, []);

  React.useEffect(() => {
    if (horarioFinal && horarioInicial) {
      console.log("deum bom");
      setIntervalos(() => gerarIntervalos(horarioInicial, horarioFinal));
    } else {
      console.log("deum ruim");
    }
  }, [reservas]);

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
      setLoad(true);
      // console.log(selectedHorarios);
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
        setLoad(false);
        Alert.alert(
          "Sala reserva foi feita com sucesso!!",
          "Deseja reservar mais?",
          [
            { text: "Não", onPress: () => router.push("/Home") },
            {
              text: "Sim",
              onPress: () => {
                setSelectedHorarios([]);
                setIntervalos(null);
                setNameReserva("");
              },
            },
          ],
        );
      } else {
        // console.log("deu eerrado");
        alert("Algo deu errado, tente novamente mais tarde.");
        router.push("/Home");
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

    // console.log(reservas);
    if (reservas) {
      // console.log();
      const teste = verificarDisponibilidade(reservas, horariosDisponiveis);

      teste.map((e: any) => {
        console.log(e.inicio, "----", e.fim, e.status);
      });
      return verificarDisponibilidade(reservas, horariosDisponiveis);
    }
    // return horariosDisponiveis;
  }

  function ajustarFusoHorario(dataISO: any) {
    const data = new Date(dataISO);
    data.setHours(data.getHours() - 3); // Subtração de 3 horas
    return data.toISOString().slice(11, 16); // Retorna no formato HH:mm
  }

  function verificarDisponibilidade(reservas: any, intervalos: any) {
    // Converter horários de reservas para formato HH:mm
    const reservasConvertidas = reservas.map((reserva: any) => ({
      inicio: ajustarFusoHorario(reserva.startTime),
      fim: ajustarFusoHorario(reserva.endTime),
    }));

    // Verificar cada intervalo
    return intervalos.map((intervalo: any) => {
      const ocupado = reservasConvertidas.some(
        (reserva: any) =>
          // Verificar sobreposição
          !(reserva.fim <= intervalo.inicio || reserva.inicio >= intervalo.fim),
      );
      return {
        ...intervalo,
        status: ocupado ? "ocupado" : "disponível",
      };
    });
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
      const retornoReservas = await getReservasParaData(
        params.salaId,
        selectedDate.toISOString().split("T")[0],
      );
      // console.log(retornoReservas);
      setReservas(retornoReservas);
    }
  }

  function isValidSelection(horario: string) {
    if (selectedHorarios.length === 0) {
      return true;
    }

    const index = intervalos.findIndex(
      (intervalo: any) => `${intervalo.inicio} - ${intervalo.fim}` === horario,
    );
    const allSelectedIndexes = selectedHorarios.map((selectedHorario) =>
      intervalos.findIndex(
        (intervalo: any) =>
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
      <View
        style={[
          { marginTop: 40, position: "relative" },
          load ? { flex: 1 } : null,
        ]}
      >
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
            {intervalos.map((intervalo: any, index: any) => {
              const horarioLabel = `${intervalo.inicio} - ${intervalo.fim}`;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleHorarioSelection(horarioLabel)}
                  style={[
                    {
                      padding: 10,
                      backgroundColor: selectedHorarios.includes(horarioLabel)
                        ? Colors.primary.main
                        : Colors.white.light,
                      marginBottom: 5,
                      borderRadius: 8,
                    },
                  ]}
                  {...(intervalo.status === "ocupado"
                    ? { disabled: true }
                    : null)}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        {
                          color: selectedHorarios.includes(horarioLabel)
                            ? Colors.white.light
                            : Colors.secundary.main,
                          maxWidth: 200,
                        },
                        intervalo.status === "ocupado"
                          ? { color: Colors.black.opacity(0.4) }
                          : null,
                      ]}
                    >
                      {horarioLabel.replace("-", "-----")}
                    </Text>
                    {intervalo.status === "ocupado" ? (
                      <Text
                        style={{
                          // backgroundColor: "red",
                          maxWidth: 200,
                          color: Colors.black.opacity(0.4),
                        }}
                      >
                        Indisponível
                      </Text>
                    ) : null}
                  </View>
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
