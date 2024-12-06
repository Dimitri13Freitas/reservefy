import {
  Pressable,
  Text,
  View,
  Alert,
  BackHandler,
  StatusBar,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import React from "react";
import { auth, ListaReservas } from "@/firebaseConfig";
import Calendar from "@/components/Calendar";
import SwapWindow from "@/components/SwapWindow";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Load } from "@/components/Load";

export default function Home() {
  const navigation = useNavigation();
  const [reservations, setReservations] = React.useState<any>([]);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [load, setLoad] = React.useState<boolean>(false);

  function handleMonthChange(month: Date) {
    setCurrentMonth(month);
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Deseja sair?",
          "Você quer sair do aplicativo ou apenas deslogar?",
          [
            { text: "Sair do App", onPress: () => BackHandler.exitApp() },
            {
              text: "Sair da Conta",
              onPress: async () => {
                await auth.signOut();
                await AsyncStorage.setItem("groupId", "");
                navigation.reset({
                  index: 0,
                  routes: [{ name: "SignIn" }],
                });
              },
            },
            { text: "Cancelar", style: "cancel" },
          ],
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation]),
  );

  React.useEffect(() => {
    handleReservas();
  }, []);

  async function handleReservas() {
    setLoad(true);
    const retornoReservas: any = await ListaReservas();
    if (retornoReservas) {
      setReservations(retornoReservas);
      setLoad(false);
    } else {
      setLoad(false);
      console.log("deu ruim o Retorno reservas Home", retornoReservas);
    }
  }

  const [hasNotification, setHasNotification] = React.useState(true);

  function handleMenuPress() {
    router.push("./Menu");
  }

  return (
    <>
      <GestureHandlerRootView style={styles.screenContainer}>
        <StatusBar backgroundColor="transparent" translucent={true} />
        <SwapWindow currentMonth={currentMonth} reservations={reservations} />
        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              padding: 8,
              paddingLeft: 0,
            }}
            onPress={handleMenuPress}
          >
            <LottieView
              style={{
                width: 40,
                height: 17,
              }}
              source={require("../assets/menu.json")}
              loop={false}
              autoPlay
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
          <Calendar
            initialDate={new Date()}
            onMonthChange={handleMonthChange}
            reservations={reservations}
          />
        </View>
      </GestureHandlerRootView>
    </>
  );
}
