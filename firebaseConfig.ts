import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getReactNativePersistence,
  sendPasswordResetEmail,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  initializeAuth,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";

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

// Função para criar o usuário
async function createUser(
  email: string,
  password: string,
  name: string,
  label: string[],
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

    // Configura a função de administrador e armazenamento local se necessário
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
    });

    // Se for admin, efetua logout
    if (label.includes("admin")) {
      await auth.signOut();
    }
    return user;
  } catch (error) {
    // console.log("Erro ao efetuar cadastro de usuário: ", error);
    return error;
  }
}

// Função fictícia para criar grupo (adicione a lógica específica)
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
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth!,
      email,
      password,
    );
    return true;
  } catch (error: any) {
    return error;
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

export { auth, createUser, createGroup, logIn, resetPassword };
