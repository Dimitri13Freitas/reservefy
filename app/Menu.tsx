import React from "react";
import { Text, View, Alert, Pressable, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import styles from "../constants/styles";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Menu() {
  const nomeUser = auth.currentUser?.displayName;
  const [permission, setPermission] = React.useState<string | null>("");
  React.useEffect(() => {
    handlePermissions();
  });

  async function handlePermissions() {
    const role: string | null = await AsyncStorage.getItem("role");
    // console.log(role);
    setPermission(role);
  }

  return (
    <View
      style={[styles.screenContainer, { width: "100%", alignItems: "center" }]}
    >
      <View style={{ marginTop: 50 }}>
        <View style={{ display: "flex", alignItems: "center" }}>
          <FontAwesome
            name="user-circle-o"
            size={68}
            color={Colors.secundary.main}
          />
          <Text style={[styles.textDarkColor, { fontSize: 18, marginTop: 10 }]}>
            {nomeUser ? nomeUser : "nome do usuário"}
          </Text>
        </View>
        <View
          style={{
            marginTop: 30,
            paddingTop: 15,
            paddingHorizontal: 15,
            flex: 1,
            gap: 10,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            backgroundColor: Colors.white.light,
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/UserAtas")}
            style={styles.menuOptionComponent}
          >
            <View>
              <Text style={styles.menuOptionTitle}>Minhas Atas</Text>
              <Text style={styles.menuOptionDesc}>
                Deixe uma inteligencia artifical fazer sua ata de Reunião.
              </Text>
            </View>
          </TouchableOpacity>
          {permission === "admin/common" ? (
            <TouchableOpacity
              onPress={() => router.push("./AddMember")}
              style={styles.menuOptionComponent}
            >
              <View>
                <Text style={styles.menuOptionTitle}>Adicionar Membro</Text>
                <Text style={styles.menuOptionDesc}>
                  Adicione membros ao grupo para fazer reservas.
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
          {permission === "admin" ? (
            <TouchableOpacity
              onPress={() => router.push("/GerenciaUsers")}
              style={styles.menuOptionComponent}
            >
              <Text style={styles.menuOptionTitle}>Gerenciar Membros</Text>
              <Text style={styles.menuOptionDesc}>
                Gerencie os membros do grupo para organizar reservas.
              </Text>
            </TouchableOpacity>
          ) : null}
          {permission === "admin/common" ? (
            <TouchableOpacity
              onPress={() => router.push("/AddSala")}
              style={styles.menuOptionComponent}
            >
              <Text style={styles.menuOptionTitle}>Criar Sala</Text>
              <Text style={styles.menuOptionDesc}>
                Registre um novo espaço no seu grupo
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}
