import React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import styles from "../constants/styles";
import { Entypo } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface InputProps extends TextInputProps {
  placeholder: string;
  type?: "password" | "text" | "email";
  label: string;
  err: boolean;
}

export function Input({ placeholder, type, label, err, ...props }: InputProps) {
  const [focus, setFocus] = React.useState(false);
  const [showPass, setShowPass] = React.useState(true);

  if (type === "password") {
    return (
      <View>
        <Text style={[styles.labelInput]}>{label}</Text>
        <View
          style={[
            styles.input,
            focus ? styles.inputFocus : null,
            err ? styles.inputError : null,
            {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 0,
            },
          ]}
        >
          <TextInput
            {...props}
            placeholder={placeholder}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{ padding: 12, flex: 1 }}
            secureTextEntry={showPass}
          />
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            style={{
              padding: 12,
            }}
          >
            <Entypo
              name={showPass ? "eye" : "eye-with-line"}
              size={26}
              color={Colors.secundary.main}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <Text style={[styles.labelInput]}>{label}</Text>
        <TextInput
          {...props}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...(type === "email" ? { keyboardType: "email-address" } : null)}
          style={[
            styles.input,
            focus ? styles.inputFocus : null,
            err ? styles.inputError : null,
          ]}
        />
      </View>
    );
  }
}
