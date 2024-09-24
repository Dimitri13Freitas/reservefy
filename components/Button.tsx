import React from "react";
import { Text, View, Pressable } from "react-native";
import styles from "../constants/styles";

interface ButtonProps {
  text: string;
}

export function Button({ text }: ButtonProps) {
  let [focus, setFocus] = React.useState(false);

  return (
    <View>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </View>
  );
}
