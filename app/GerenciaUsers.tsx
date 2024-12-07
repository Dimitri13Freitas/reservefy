import React from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import styles from "../constants/styles";
import {
  addAdminRole,
  auth,
  fetchUsers,
  removeAdminRole,
} from "../firebaseConfig";
import { Load } from "@/components/Load";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

export default function GerenciaUsers() {
  const [userList, setUserList] = React.useState<any[]>([]);
  const [load, setLoad] = React.useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");
  const [typeUser, setTypeUser] = React.useState("");
  const [btnBug, setBtnBug] = React.useState<boolean>(true);
  const [searchBar, setSearchBar] = React.useState<string>("");

  React.useEffect(() => {
    handleSeila();
  }, []);

  async function handleSeila() {
    setLoad(true);
    const users = await fetchUsers();
    if (users) {
      setLoad(false);
      setUserList(users);
    } else {
      setLoad(false);
      console.log("algo deu errado na busca por usuários");
    }
  }

  function verificaPerfil(e: any) {
    if (e.includes("admin") && e.includes("common")) {
      return "Administrador/Comum";
    } else if (e.includes("common")) {
      return "Comum";
    } else if (e.includes("admin")) {
      return "Administrador";
    }
  }

  const filteredUsers = userList.filter((e) =>
    e.userName.toLowerCase().includes(searchBar.toLowerCase()),
  );

  function handlePress(userId: any, label: any) {
    setSelectedUserId(userId);
    setTypeUser(label);
    if (selectedUserId === userId) {
      setSelectedUserId("");
    }
  }

  async function handleAddAccess(userId: string) {
    Alert.alert(
      "Confirmação!",
      "Deseja realmente conceder acesso de administrador este usuário?",
      [
        { text: "Não" },
        {
          text: "Sim",
          onPress: async () => {
            const returnAddAdminRole = await addAdminRole(userId);
            await handleSeila();
            if (returnAddAdminRole) {
              Alert.alert("Permissão concedida com sucesso!!", "", [
                { text: "Ok" },
              ]);
            }
          },
        },
      ],
    );
  }

  async function handleRemoveAccess(userId: string) {
    Alert.alert(
      "Confirmação!",
      "Deseja realmente retirar acesso de administrador este usuário?",
      [
        { text: "Não" },
        {
          text: "Sim",
          onPress: async () => {
            const returnRemoveAdminRole = await removeAdminRole(userId);
            await handleSeila();
            if (returnRemoveAdminRole) {
              Alert.alert("Permissão retirada com sucesso!!", "", [
                { text: "Ok" },
              ]);
            }
          },
        },
      ],
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.screenContainer, { width: "100%" }]}>
          <View style={{ marginTop: 60 }}>
            <TextInput
              style={{
                fontSize: 16,
                color: Colors.secundary.main,
                borderWidth: 2,
                borderColor: Colors.white.light,
                backgroundColor: Colors.white.light,
                padding: 10,
                borderRadius: 8,
              }}
              placeholder="Pesquisar por usuário"
              value={searchBar}
              onChangeText={(e) => setSearchBar(e)}
              onFocus={() => setBtnBug(false)}
              onBlur={() => setBtnBug(true)}
            />
            <Text
              style={{ fontSize: 24, fontWeight: "bold", marginVertical: 15 }}
            >
              Lista de usuários:
            </Text>
            {userList.length !== 0 && !load ? (
              <>
                <ScrollView style={{ height: 300 }}>
                  {filteredUsers.map((e) => {
                    let label = verificaPerfil(e.role);
                    if (e.userId !== auth.currentUser?.uid) {
                      const isSelected = e.userId === selectedUserId;
                      return (
                        <Pressable
                          onPress={() => handlePress(e.userId, label)}
                          key={e.userId}
                          style={[
                            styles.salaContainer,
                            {
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 15,
                              padding: 12,
                              borderWidth: 2,
                              borderColor: isSelected
                                ? Colors.primary.main
                                : "transparent",
                            },
                          ]}
                        >
                          <FontAwesome
                            name="user-circle-o"
                            size={46}
                            color={Colors.secundary.main}
                          />
                          <View>
                            <Text style={styles.userName}>
                              Nome: {e.userName}
                            </Text>
                            <Text style={styles.userTypeAccount}>
                              Tipo: {label}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    }
                  })}
                </ScrollView>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginVertical: 10,
                  }}
                >
                  Menu de opções do usuário:
                </Text>
                {selectedUserId ? (
                  <View>
                    {typeUser === "Comum" ? (
                      <TouchableOpacity
                        style={{
                          marginTop: 10,
                          backgroundColor: Colors.secundary.main,
                          paddingVertical: 10,
                          paddingHorizontal: 24,
                          borderRadius: 8,
                          alignItems: "center",
                        }}
                        onPress={() => handleAddAccess(selectedUserId)}
                      >
                        <Text style={{ color: Colors.white.main }}>
                          Atribuir acesso de Administrador
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          marginTop: 10,
                          backgroundColor: Colors.secundary.main,
                          paddingVertical: 10,
                          paddingHorizontal: 24,
                          borderRadius: 8,
                          alignItems: "center",
                        }}
                        onPress={() => handleRemoveAccess(selectedUserId)}
                      >
                        <Text style={{ color: Colors.white.main }}>
                          Retirar acesso de Administrador
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={{
                        marginTop: 10,
                        backgroundColor: Colors.secundary.main,
                        paddingVertical: 10,
                        paddingHorizontal: 24,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: Colors.white.main }}>
                        Remover usuário
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.smoothText}>Selecione um usuário</Text>
                  </View>
                )}
              </>
            ) : (
              <Load />
            )}
          </View>
          {btnBug ? (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.secundary.main,
                paddingVertical: 10,
                paddingHorizontal: 24,
                borderRadius: 8,
                alignItems: "center",
                position: "absolute",
                bottom: 20,
                right: 20,
                width: "100%",
              }}
              onPress={() => router.push("/AddMember")}
            >
              <AntDesign name="plus" size={24} color={Colors.white.main} />
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
