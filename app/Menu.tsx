import React from "react";
import { Text, View, Alert, Pressable, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import styles from "../constants/styles";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export default function Menu() {
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
            Nome Do usuário
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
          <TouchableOpacity style={styles.menuOptionComponent}>
            <Text style={styles.menuOptionTitle}>Gerenciar Membros</Text>
            <Text style={styles.menuOptionDesc}>
              Gerencie os membros do grupo para organizar reservas.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/AddSala")}
            style={styles.menuOptionComponent}
          >
            <Text style={styles.menuOptionTitle}>Criar Sala</Text>
            <Text style={styles.menuOptionDesc}>
              Registre um novo espaço no seu grupo
            </Text>
          </TouchableOpacity>
          <Pressable style={styles.menuOptionComponent}>
            <Text style={styles.menuOptionTitle}>Excluir Grupo</Text>
            <Text style={styles.menuOptionDesc}></Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
