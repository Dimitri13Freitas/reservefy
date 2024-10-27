import React from "react";
import { Text, View, Pressable } from "react-native";
import styles from "../constants/styles";

interface ButtonProps {
  text: string;
  [key: string]: any;
}

export function Button({ text, ...props }: ButtonProps) {
  return (
    <View>
      <Pressable {...props} style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </View>
  );
}
