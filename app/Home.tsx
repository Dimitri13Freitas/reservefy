import { Pressable, Text, View } from "react-native";
import styles from "../constants/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import React from "react";
import Calendar from "@/components/Calendar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
// import { StatusBar } from "expo-status-bar";

export default function Home() {
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const handleSheetChanges = React.useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [hasNotification, setHasNotification] = React.useState(true);
  const reservations = [
    {
      id: 1,
      date: new Date(2024, 9, 13),
      description: "Sala de Reunião",
      startTime: "10:00",
      endTime: "12:00",
    },
    {
      id: 2,
      date: new Date(2024, 9, 17),
      description: "Treinamento",
      startTime: "09:00",
      endTime: "11:00",
    },
  ];
  return (
    <GestureHandlerRootView style={styles.screenContainer}>
      {/* <StatusBar style="auto" /> */}
      <BottomSheet
        index={0}
        snapPoints={["30%", "70%"]}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        // style={{ position: "relative", zIndex: 99999999999999 }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            padding: 36,
            alignItems: "center",
          }}
        >
          <Text>Awesome</Text>
        </BottomSheetView>
      </BottomSheet>
      <View
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable>
          <FontAwesome
            name="user-circle-o"
            size={28}
            color={Colors.secundary.main}
          />
        </Pressable>
        <Pressable
          style={{
            backgroundColor: Colors.secundary.main,
            padding: 4,
            borderRadius: 5,
            position: "relative",
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={28}
            color={Colors.primary.light}
          />
          {hasNotification ? (
            <View
              style={{
                position: "absolute",
                width: 15,
                height: 15,
                borderRadius: 999,
                borderWidth: 3,
                borderStyle: "solid",
                right: -5,
                top: -5,
                borderColor: Colors.primary.light,
                backgroundColor: Colors.primary.main,
              }}
            ></View>
          ) : null}
        </Pressable>
      </View>
      <View>
        <Text
          style={[
            styles.textLightColor,
            { fontSize: 30, fontWeight: "normal", marginTop: 40 },
          ]}
        >
          Minhas reservas
        </Text>
        <Calendar initialDate={new Date()} reservations={reservations} />
      </View>
    </GestureHandlerRootView>
  );
}
