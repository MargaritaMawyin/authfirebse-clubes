import React, { useState, useEffect } from "react";
import Home from "./screens/Home";
import Login from "./screens/Login";

import firebaseApp from "./firebase/credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
  const [user, setUser] = useState(null);

  async function getRol(uid) {
    const docuRef = doc(firestore, `usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const data = docuCifrada.data();
    return { rol: data.rol, nombre: data.nombre };
  }

  function setUserWithFirebaseAndRol(usuarioFirebase) {
    getRol(usuarioFirebase.uid).then((info) => {
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: info.rol,
        nombre: info.nombre,
      };

      setUser(userData);
      console.log("userData final", userData);
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        if (!user) {
          setUserWithFirebaseAndRol(usuarioFirebase);
        }
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  return <>{user ? <Home user={user} /> : <Login />}</>;
}

export default App;
