import { Text, View, ImageBackground } from "react-native";
import styles from "../constants/styles";
import LottieView from "lottie-react-native";
import { Input } from "@/components/Input";

export default function Index() {
  return (
    <View style={[styles.screenContainer, { width: "100%" }]}>
      <View style={{ width: "100%" }}>
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
        <Input type="email" label="Email:" placeholder="Digite seu email" />
        <Input type="password" label="Senha:" placeholder="•••••••••" />
      </View>
      <LottieView
        style={{
          width: 530,
          height: 530,
          position: "absolute",
          top: -10,
          right: -280,
          zIndex: -2,
        }}
        source={require("../assets/circulo5.json")}
        loop={false}
        autoPlay
      />
      <LottieView
        style={{
          width: 530,
          height: 530,
          position: "absolute",
          bottom: -230,
          left: -290,
          zIndex: -2,
        }}
        source={require("../assets/circulo3.json")}
        loop={false}
        autoPlay
      />
    </View>
  );
}
