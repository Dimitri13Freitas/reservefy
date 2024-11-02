import React from "react";
import { Text, View, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";

export default function SwapWindow({ ...props }) {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const handleSheetChanges = React.useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  return (
    <BottomSheet
      index={0}
      snapPoints={["30%", "70%"]}
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
    >
      <BottomSheetView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 6,
        }}
      >
        <Text style={styles.sheetTitle}>Reservas:</Text>
        <View style={styles.reserveElement}>
          <View style={styles.dayContainer}>
            <Text style={[styles.dayTitle]}>13</Text>
            <Text style={styles.sheetTitle}>Sex.</Text>
          </View>
          <View style={styles.reserveInfo}>
            <Text style={styles.reserveRoom}>Sala de Treinamento</Text>
            <View style={styles.reserveTime}>
              <Text style={styles.time}>09:00</Text>
              <Text style={{ color: Colors.primary.main }}>------</Text>
              <Text style={styles.time}>10:00</Text>
            </View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetTitle: {
    fontSize: 24,
    fontWeight: "bold",
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
  },
});
