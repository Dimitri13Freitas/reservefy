import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getReactNativePersistence,
  sendPasswordResetEmail,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  updatePassword,
  initializeAuth,
  updateProfile,
  User,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAsHvdDFWYGWbTiHi6el3OqCcqEMnjXNZc",
  authDomain: "com.reservefy.tcc",
  databaseURL: "https://reservefy-7749f.firebaseio.com",
  projectId: "reservefy-7749f",
  storageBucket: "reservefy-7749f.appspot.com",
  messagingSenderId: "386229484356",
  appId: "1:386229484356:android:66272429ecc0ce0fa8f511",
};

// Inicialize o Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicialize o Firestore
const db = getFirestore(app);

async function createUser(
  email: string,
  password: string,
  name: string,
  label: string[],
  provPassword: boolean,
): Promise<any> {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;
    await updateProfile(user, {
      displayName: name,
    });

    if (label.includes("admin")) {
      await createGroup(name);
      await AsyncStorage.setItem("userRole", "admin");
    }

    const groupId = await AsyncStorage.getItem("groupId");
    if (!groupId) {
      throw new Error("Group ID não encontrado");
    }

    // Define o documento do usuário no Firestore
    await setDoc(doc(db, `grupo/${groupId}/users`, user.uid), {
      role: label,
      userName: user.displayName,
      userId: user.uid,
      provPassword,
    });

    // Se for admin, efetua logout
    if (label.includes("admin")) {
      await auth.signOut();
    }
    return user;
  } catch (error) {
    return error;
  }
}

async function createGroup(groupName: string): Promise<void> {
  const userId: string | undefined = auth!.currentUser?.uid;
  if (!userId) {
    console.error("Usuário não autenticado.");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "grupo"), {
      nome: groupName,
      proprietario: userId,
    });

    // Armazena o groupId no AsyncStorage
    await AsyncStorage.setItem("groupId", docRef.id);

    console.log("Grupo criado com ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao criar grupo:", error);
  }
}

async function logIn(email: string, password: string) {
  const groupId = await AsyncStorage.getItem("groupId");
  if (!groupId) {
    throw new Error("Grupo ID não encontrado");
  }

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth!,
      email,
      password,
    );

    return userCredential.user;
  } catch (error: any) {
    return error;
  }
}

async function selectPerfil(groupId: string, userId: string) {
  const userDocRef = doc(db, `grupo/${groupId}/users`, userId);
  const userDoc = await getDoc(userDocRef);

  // buscar no banco valor de "provPassword"
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    throw new Error("Usuário não encontrado.");
  }
}

async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail de redefinição de senha: ", error);
    return false;
  }
}

async function updateProvPassword(
  groupId: string | null,
  user: User,
  newPass: string,
) {
  try {
    const userDocRef = doc(db, `grupo/${groupId}/users`, user.uid);

    await updateDoc(userDocRef, {
      provPassword: false,
    });

    await updatePassword(user, newPass);
    console.log("Campo provPassword atualizado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar o campo:", error);
    return false;
  }
}

async function createSala(
  nomeDaSala: string,
  horarioInicio: string,
  horarioFinal: string,
) {
  const groupId = await AsyncStorage.getItem("groupId");
  if (!groupId) {
    throw new Error("Group ID não encontrado");
  }

  try {
    const salaRef = await addDoc(collection(db, `grupo/${groupId}/espacos`), {
      nome: nomeDaSala,
      horaDisp: {
        horarioInicio,
        horarioFinal,
      },
    });
    console.log("Sala criada com sucesso:", salaRef.id);
    return true;
  } catch (error) {
    console.error("Erro ao criar a sala:", error);
    return false;
  }
}

async function listaSalas() {
  try {
    const groupId = await AsyncStorage.getItem("groupId");
    if (!groupId) {
      throw new Error("Group ID não encontrado");
    }

    // Referência à coleção "espacos" dentro do grupo
    // const espacosRef = collection(db, grupo/${groupId}/espacos);
    const espacosRef = collection(db, `grupo/${groupId}/espacos`);
    const snapshot = await getDocs(espacosRef);

    const salas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return salas; // Retorna um array com as informações das salas
  } catch (error) {
    console.error("Erro ao listar salas do grupo:", error);
    return [];
  }
}

// async function selectSala(){
//   const userDocRef = doc(db, `grupo/${groupId}/users`, userId);
//   const userDoc = await getDoc(userDocRef);

//   // buscar no banco valor de "provPassword"
//   if (userDoc.exists()) {
//     return userDoc.data();
//   } else {
//     throw new Error("Usuário não encontrado.");
//   }
// }

async function criarReserva(
  espacoId: string,
  inicio: string,
  fim: string,
  nomeReuniao: string,
) {
  try {
    // const disponivel = await verificarDisponibilidade(inicio, fim);

    // if (!disponivel) {
    //   Alert.alert("Esse horário já está ocupado.");
    //   return;
    // }

    const groupId = await AsyncStorage.getItem("groupId");
    if (!groupId) {
      throw new Error("Group ID não encontrado");
    }

    const reservasRef = collection(
      db,
      `grupo/${groupId}/espacos/${espacoId}/reservas`,
    );

    await addDoc(reservasRef, {
      // startTime: new Date(2024-11-21T${inicio}:00Z).toISOString(),
      // endTime: new Date(2024-11-21T${fim}:00Z).toISOString(),
      startTime: new Date(inicio).toISOString(),
      endTime: new Date(fim).toISOString(),
      nomeReuniao,
      userId: auth.currentUser?.uid, // Exemplo de userId, deve vir do login do usuário
    });
    // Alert.alert("Reserva criada com sucesso!");
    return true;
  } catch (err) {
    console.log("Firebase Error: ", err);
    return false;
  }
}

// async function verificarDisponibilidade(groupId: string, espacoId: string, inicio: string, fim: string) {
//   const reservasRef = collection(
//     db,
//     `grupo/${groupId}/espacos/${espacoId}/reservas`,
//   );

//   // Convertendo os horários para o formato que Firebase pode comparar
//   const startTime = new Date(`2024-11-21T${inicio}:00Z`).toISOString(); // Exemplo de horário 09:00
//   const endTime = new Date(`2024-11-21T${fim}:00Z`).toISOString(); // Exemplo de horário 10:00

//   const q = query(
//     reservasRef,
//     where("startTime", "<", endTime), // Reserva começa antes de terminar o novo intervalo
//     where("endTime", ">", startTime), // Reserva termina depois de começar o novo intervalo
//   );

//   const snapshot = await getDocs(q);
//   return snapshot.empty; // Se a query não encontrar documentos, significa que está disponível
// }

export {
  auth,
  User,
  createUser,
  selectPerfil,
  createGroup,
  logIn,
  listaSalas,
  resetPassword,
  updateProvPassword,
  createSala,
  criarReserva,
};
