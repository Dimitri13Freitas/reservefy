import { StyleSheet, Platform } from "react-native";
import Colors from "./Colors";

const styles = StyleSheet.create({
  salaContainer: {
    padding: 20,
    backgroundColor: Colors.opacityPrymary(0.2),
    borderRadius: 8,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.secundary.main,
  },
  userTypeAccount: {
    fontSize: 12,
    fontWeight: "semibold",
    color: Colors.black.opacity(0.5),
  },
  textLightColor: {
    color: Colors.secundary.light,
  },
  textDarkColor: {
    color: Colors.secundary.main,
  },
  menuOptionComponent: {
    minWidth: "100%",
    padding: 12,
    backgroundColor: Colors.primary.light,
    borderRadius: 15,
  },
  menuOptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuOptionDesc: {
    fontSize: 14,
    color: Colors.secundary.light,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primary.light,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  simpleLink: {
    marginTop: 16,
    color: Colors.secundary.light,
    textDecorationLine: "underline",
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: Colors.secundary.main,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white.main,
    fontSize: 16,
  },
  smoothText: {
    color: Colors.secundary.light,
    fontWeight: "600",
    opacity: 0.6,
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
    paddingBottom: 50,
  },
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
  },
  inputError: {
    borderColor: Colors.red,
  },
  textError: {
    color: Colors.red,
    textAlign: "right",
  },
  labelInput: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.secundary.main,
  },
  picker: {
    backgroundColor: Colors.white.main,
    borderRadius: 8,
  },
});

export default styles;
