import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import styles from "@/constants/styles";
import { listaSalas } from "@/firebaseConfig";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { router, useGlobalSearchParams } from "expo-router";
import { Load } from "@/components/Load";

export default function Index() {
  const [salas, setSalas] = React.useState<any[]>([]);
  const [load, setLoad] = React.useState<boolean>(false);

  const params = useGlobalSearchParams();

  React.useEffect(() => {
    setLoad(true);
    const fetchSalas = async () => {
      const salasData = await listaSalas();
      // console.log(salasData);
      setSalas(salasData);
      setLoad(false);
    };
    fetchSalas();
  }, []);

  return (
    <GestureHandlerRootView style={[styles.screenContainer, { width: "100%" }]}>
      <View style={{ marginTop: 100, position: "relative" }}>
        <Text
          style={[
            styles.textLightColor,
            { fontSize: 30, fontWeight: "normal", marginBottom: 20 },
          ]}
        >
          Encontre sua sala
        </Text>
        {load ? (
          <Load />
        ) : (
          <FlatList
            data={salas}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={styles.salaContainer}
                onPress={() => {
                  // console.log(item.id);
                  router.push({
                    pathname: "/Reserva",
                    params: { salaId: item.id, ...params },
                  });
                }}
              >
                <Text
                  style={[
                    styles.textDarkColor,
                    { fontWeight: "600", fontSize: 22, maxWidth: 180 },
                  ]}
                >
                  {item.nome}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
        {/* <Load /> */}
      </View>
    </GestureHandlerRootView>
  );
}
