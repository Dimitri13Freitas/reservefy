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
  query,
  where,
  arrayUnion,
  arrayRemove,
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
      await AsyncStorage.setItem("pass", password);
      await AsyncStorage.setItem("email", email);
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

    await auth.signOut();
    // Se for admin, efetua logout
    if (label.includes("admin") || label.includes("common")) {
      const email: any = await AsyncStorage.getItem("email");
      const password: any = await AsyncStorage.getItem("pass");
      if (email && password) {
        const returnUser = await logIn(email, password);
        // console.log("sobre o login", returnUser);
      } else {
        console.log("no caso n tem como pois email e senha n existe do login");
      }
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

async function findGroupIdForUser(userId: string): Promise<string | null> {
  try {
    // Busca todos os grupos
    const groupsCollection = collection(db, "grupo");
    const groupSnapshot = await getDocs(groupsCollection);

    for (const groupDoc of groupSnapshot.docs) {
      const groupId = groupDoc.id;

      // Verifica se o usuário pertence a este grupo
      const usersCollection = collection(db, `grupo/${groupId}/users`);
      const userQuery = query(usersCollection, where("userId", "==", userId));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        return groupId; // Retorna o groupId do grupo encontrado
      }
    }

    throw new Error("Usuário não pertence a nenhum grupo");
  } catch (error) {
    console.error("Erro ao buscar o Group ID no banco:", error);
    return null;
  }
}

async function logIn(email: string, password: string) {
  let groupId = await AsyncStorage.getItem("groupId");

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth!,
      email,
      password,
    );

    const userId = userCredential.user.uid;

    if (!groupId) {
      console.log(
        "Group ID não encontrado no AsyncStorage. Buscando no banco...",
      );

      // Busca o groupId no banco com base no userId
      groupId = await findGroupIdForUser(userId);

      if (!groupId) {
        throw new Error("Group ID não encontrado no banco de dados");
      }

      // Armazena o groupId no AsyncStorage
      await AsyncStorage.setItem("groupId", groupId);
    }

    return userCredential.user;
  } catch (error: any) {
    // console.error("Erro no login:", error);
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

async function selectSala(espacoId: string) {
  const groupId = await AsyncStorage.getItem("groupId");
  if (!groupId) {
    throw new Error("Group ID não encontrado");
  }
  const userDocRef = doc(db, `grupo/${groupId}/espacos/${espacoId}`);
  const userDoc = await getDoc(userDocRef);

  // buscar no banco valor de "provPassword"
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    throw new Error("Usuário não encontrado.");
  }
}

async function criarReserva(
  espacoId: string,
  inicio: string,
  fim: string,
  nomeReuniao: string,
) {
  try {
    // Obter o ID do grupo do AsyncStorage
    const groupId = await AsyncStorage.getItem("groupId");
    if (!groupId) {
      throw new Error("Group ID não encontrado");
    }

    // Referência para o nó de reservas centralizadas
    const reservasRef = collection(db, `grupo/${groupId}/reservas`);

    // Adicionar uma nova reserva
    await addDoc(reservasRef, {
      espacoId, // Referência ao espaço onde será feita a reserva
      startTime: new Date(inicio).toISOString(), // Horário de início da reserva
      endTime: new Date(fim).toISOString(), // Horário de término da reserva
      nomeReuniao, // Nome da reunião
      userId: auth.currentUser?.uid, // ID do usuário logado
    });

    console.log("Reserva criada com sucesso!");
    return true;
  } catch (err) {
    console.error("Erro ao criar a reserva:", err);
    return false;
  }
}

async function ListaReservas() {
  try {
    const groupId = await AsyncStorage.getItem("groupId");
    if (!groupId) {
      console.log("este é o log");
      throw new Error("Group ID não encontrado");
    }

    const userId = auth.currentUser?.uid;

    const reservationsRef = query(
      collection(db, `grupo/${groupId}/reservas`),
      where("userId", "==", userId),
    );
    const snapshot = await getDocs(reservationsRef);

    const reservationsData = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: new Date(data.startTime),
        nameReuniao: data.nomeReuniao,
        startTime: data.startTime,
        endTime: data.endTime,
        userId: data.userId,
      };
    });

    return reservationsData;
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return false;
  }
}

async function getReservasParaData(espacoId: string, data: string) {
  // console.log("getReservasParaData iniciou.....");
  const groupId = await AsyncStorage.getItem("groupId");
  if (!groupId) {
    throw new Error("Group ID não encontrado");
  }
  const reservasRef = collection(db, `grupo/${groupId}/reservas`);
  const q = query(
    reservasRef,
    where("espacoId", "==", espacoId),
    where("startTime", ">=", `${data}T00:00:00.000Z`),
    where("startTime", "<", `${data}T23:59:59.999Z`),
  );
  const querySnapshot = await getDocs(q);
  const reservas = querySnapshot.docs.map((doc) => doc.data());
  return reservas;
}

async function fetchUsers() {
  try {
    const groupId = await AsyncStorage.getItem("groupId");
    if (!groupId) {
      throw new Error("Group ID não encontrado");
    }
    const q = query(collection(db, `grupo/${groupId}/users`));
    const querySnapshot = await getDocs(q);
    const usersList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usersList;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  }
}

async function addAdminRole(userId: string): Promise<boolean | undefined> {
  try {
    const groupId = await AsyncStorage.getItem("groupId");
    if (!groupId) {
      throw new Error("Group ID não encontrado");
    }
    // Referência ao documento do usuário no Firestore
    const userDocRef = doc(db, `/grupo/${groupId}/users`, userId);

    // Atualiza o campo `role`, adicionando "admin" se ainda não estiver presente
    await updateDoc(userDocRef, {
      role: arrayUnion("admin"),
    });

    console.log(`Admin role adicionado para o usuário com ID: ${userId}`);
    return true;
  } catch (error) {
    console.error("Erro ao adicionar papel de admin:", error);
    return false;
  }
}

async function removeAdminRole(userId: string): Promise<boolean | undefined> {
  try {
    const groupId = await AsyncStorage.getItem("groupId");
    if (!groupId) {
      throw new Error("Group ID não encontrado");
    }
    // Referência ao documento do usuário no Firestore
    const userDocRef = doc(db, `/grupo/${groupId}/users`, userId);

    // Atualiza o campo `role`, adicionando "admin" se ainda não estiver presente
    await updateDoc(userDocRef, {
      role: arrayRemove("admin"),
    });

    console.log(`Admin role removido para o usuário com ID: ${userId}`);
    return true;
  } catch (error) {
    console.error("Erro ao remover papel de admin:", error);
    return false;
  }
}

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
  fetchUsers,
  createSala,
  criarReserva,
  ListaReservas,
  selectSala,
  addAdminRole,
  removeAdminRole,
  getReservasParaData,
  db,
};
