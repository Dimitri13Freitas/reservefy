import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";

interface SwapWindowProps {
  currentMonth: Date;
  reservations: Reservation[];
}
export interface Reservation {
  id: number;
  date: Date;
  nameReuniao: string;
  description: string;
  startTime: string;
  endTime: string;
}

function getHourFromDateString(dateString: string): string {
  const date = new Date(dateString); // Converte a string para um objeto Date
  const hours = date.getHours().toString().padStart(2, "0"); // Obtém as horas com 2 dígitos
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Obtém os minutos com 2 dígitos

  return `${hours}:${minutes}`; // Retorna o formato HH:mm
}

const SwapWindow: React.FC<SwapWindowProps> = ({
  currentMonth,
  reservations,
}) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const handleSheetChanges = React.useCallback((index: number) => {}, []);
  const [existsReservas, setExistsReservas] = React.useState(true);

  // Filtrar reservas do mês ativo
  const filteredReservations = reservations.filter((reservation) => {
    return (
      reservation.date.getFullYear() === currentMonth.getFullYear() &&
      reservation.date.getMonth() === currentMonth.getMonth()
    );
  });

  return (
    <BottomSheet
      index={0}
      snapPoints={["40%", "73%"]}
      ref={bottomSheetRef}
      enableContentPanningGesture={false}
      overDragResistanceFactor={1.5}
      onChange={handleSheetChanges}
    >
      <BottomSheetView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 6,
          gap: 10,
        }}
      >
        {reservations.length != 0 ? (
          <ScrollView style={{ overflow: "hidden" }}>
            <Text style={styles.sheetTitle}>Minhas reservas:</Text>
            {filteredReservations.length === 0 ? (
              <Text style={styles.smoothText}>
                Você ainda não tem reservas neste mês.
              </Text>
            ) : (
              <>
                {filteredReservations.map((reservation) => {
                  return (
                    <View key={reservation.id} style={styles.reserveElement}>
                      <View style={styles.dayContainer}>
                        <Text style={[styles.dayTitle]}>
                          {reservation.date.getDate().toLocaleString().length <
                          2
                            ? `0${reservation.date.getDate()}`
                            : reservation.date.getDate()}
                        </Text>
                        <Text style={styles.sheetTitle}>
                          {
                            [
                              "Dom.",
                              "Seg.",
                              "Ter.",
                              "Qua.",
                              "Qui.",
                              "Sex.",
                              "Sab.",
                            ][reservation.date.getDay()]
                          }
                        </Text>
                      </View>
                      <View style={styles.reserveInfo}>
                        <Text style={styles.reserveRoom}>
                          {reservation.nameReuniao}
                        </Text>
                        <View style={styles.reserveTime}>
                          <Text style={styles.time}>
                            {getHourFromDateString(reservation.startTime)}
                          </Text>
                          <Text style={{ color: Colors.primary.main }}>
                            ------
                          </Text>
                          <Text style={styles.time}>
                            {getHourFromDateString(reservation.endTime)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </ScrollView>
        ) : (
          <Text style={styles.smoothText}>Você não tem nenhuma reserva.</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetTitle: {
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 12,
  },
  smoothText: {
    color: Colors.secundary.light,
    fontWeight: "600",
    opacity: 0.6,
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
    paddingBottom: 50,
  },
  dayTitle: {
    fontSize: 40,
    fontWeight: "bold",
  },
  time: {
    fontSize: 14,
  },
  reserveTime: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 5,
  },
  reserveRoom: {
    fontSize: 20,
    fontWeight: "bold",
  },
  reserveInfo: {
    paddingLeft: 15,
  },
  dayContainer: {
    paddingRight: 15,
    borderRightWidth: 2,
    borderColor: Colors.secundary.main,
  },
  reserveElement: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.primary.light,
    marginBottom: 12,
  },
});
export default SwapWindow;
