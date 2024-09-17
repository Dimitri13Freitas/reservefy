import { StyleSheet } from "react-native";
import Colors from "./Colors";

const styles = StyleSheet.create({
  textLightColor: {
    color: Colors.secundary.light,
  },
  screenContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "baseline",
    backgroundColor: "#CCF4F5",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  button: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
