import { StyleSheet, Platform } from "react-native";
import Colors from "./Colors";

const styles = StyleSheet.create({
  textLightColor: {
    color: Colors.secundary.light,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primary.light,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  // button: {
  //   backgroundColor: Colors.primary.main,
  //   paddingVertical: 12,
  //   paddingHorizontal: 24,
  //   borderRadius: 8,
  //   alignItems: "center",
  // },
  // buttonText: {
  //   color: Colors.white.main,
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  input: {
    fontSize: 16,
    color: Colors.secundary.main,
    borderWidth: 2,
    borderColor: Colors.white.light,
    backgroundColor: Colors.white.light,
    padding: 12,
    borderRadius: 8,
  },
  inputFocus: {
    borderWidth: 2,
    borderColor: Colors.primary.main,
    // shadowColor: Colors.primary.main,
    // shadowOpacity: 0.3,
    // shadowRadius: 0,
    // shadowOffset: { width: 0, height: 2 },
  },
  labelInput: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.secundary.main,
  },
});

export default styles;
