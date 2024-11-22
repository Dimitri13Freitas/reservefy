import { Pressable, Text, View, Alert, BackHandler } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import React from "react";
import { auth } from "@/firebaseConfig";
import Calendar from "@/components/Calendar";
import SwapWindow from "@/components/SwapWindow";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import LottieView from "lottie-react-native";

export default function Home() {
  const navigation = useNavigation();

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

  function handleMenuPress() {
    router.push("./Menu");
  }

  return (
    <>
      <GestureHandlerRootView style={styles.screenContainer}>
        <SwapWindow />
        <View
          style={{
            marginTop: 20,
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
          <Calendar initialDate={new Date()} reservations={reservations} />
        </View>
      </GestureHandlerRootView>
    </>
  );
}
