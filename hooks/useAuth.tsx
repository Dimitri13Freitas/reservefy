import { useState, useEffect } from "react";
import { auth } from "@/firebaseConfig";

export function useAuth() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserIsLoggedIn(true);
      } else {
        setUserIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { userIsLoggedIn };
}
