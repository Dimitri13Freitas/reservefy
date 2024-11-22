import React from "react";
import SignIn from "./SignIn";
import { SafeAreaView, View } from "react-native";
import { auth } from "@/firebaseConfig";
import { User } from "firebase/auth";
import Home from "./Home";
import { Load } from "@/components/Load";

export default function Index() {
  const [init, setInit] = React.useState(true);

  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((_user) => {
      setUser(_user);
      if (init) {
        setInit(false);
      }
    });
    return unsub;
  }, []);
  if (init) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Load />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {user ? <Home /> : <SignIn />}
    </SafeAreaView>
  );
}
