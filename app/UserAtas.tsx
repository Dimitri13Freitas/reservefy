import React from "react";
import { Text, View, Alert, Pressable } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { resetPassword } from "../firebaseConfig";
import { router } from "expo-router";

export default function UserAtas() {
  return (
    <View style={[styles.screenContainer, { width: "100%" }]}>
      <View style={{ marginTop: 60, position: "relative" }}></View>
    </View>
  );
}
