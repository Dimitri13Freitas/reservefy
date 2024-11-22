import React from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import Colors from "@/constants/Colors";

export function Load({ ...props }) {
  return <ActivityIndicator size="large" color={Colors.primary.main} />;
}
