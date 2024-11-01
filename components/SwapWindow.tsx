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
        <Text style={styles.sheetTile}>Reservas:</Text>
        <View style={styles.reserveElement}>
          <View>
            <Text style={styles.dayTitle}>13</Text>
            <Text style={styles.sheetTile}>Sex.</Text>
          </View>
          <View>
            <Text>Sala de Treinamento</Text>
            <View>
              <Text>09:00</Text>
              <Text>------</Text>
              <Text>10:00</Text>
            </View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetTile: {
    fontSize: 24,
    fontWeight: "bold",
  },
  dayTitle: {
    fontSize: 40,
    fontWeight: "bold",
  },
  reserveElement: {
    backgroundColor: Colors.primary.light,
  },
});
