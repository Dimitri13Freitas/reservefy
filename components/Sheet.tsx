import React from "react";
import { Text, View, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

export function Sheet({ ...props }) {
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
          padding: 20,
        }}
      >
        <Text style={styles.shettTitle}>Reservas:</Text>
        <View>
          <View>
            <Text>13</Text>
            <Text>Sex.</Text>
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
  shettTitle: {
    fontSize: 24,
  },
});
