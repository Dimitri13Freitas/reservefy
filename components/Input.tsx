import React from "react";
import { Text, View, TextInput } from "react-native";
import styles from "../constants/styles";

export function Input({
  placeholder,
  type,
  label,
}: {
  placeholder: string;
  type: string;
  label: string;
}) {
  let [focus, setFocus] = React.useState(false);

  return (
    <View>
      <Text style={[styles.labelInput]}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...(type === "password" ? { secureTextEntry: true } : null)}
        style={[styles.input, focus ? styles.inputFocus : null]}
      />
    </View>
  );
}
