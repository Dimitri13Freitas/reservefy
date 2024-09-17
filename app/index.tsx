import { Text, View, Image } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";

export default function Index() {
  return (
    <View style={styles.screenContainer}>
      <LottieView
        style={{
          width: 530,
          height: 530,
          position: "absolute",
          top: -10,
          right: -280,
        }}
        source={require("../assets/circulo5.json")}
        loop={false}
        autoPlay
      />

      <LottieView
        style={{
          marginTop: 120,
          width: 230,
          height: 88,
        }}
        source={require("../assets/staticLogo.json")}
        loop={false}
        autoPlay
      />
      <Text style={[styles.textLightColor, { fontSize: 20 }]}>
        Bem-vindo de volta.
      </Text>
      <LottieView
        style={{
          width: 530,
          height: 530,
          position: "absolute",
          bottom: -230,
          left: -290,
        }}
        source={require("../assets/circulo3.json")}
        loop={false}
        autoPlay
      />
      {/* </View> */}
    </View>
  );
}
