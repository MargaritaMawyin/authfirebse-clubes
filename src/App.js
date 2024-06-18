import React, { useState,useEffect  } from "react";

import Home from "./screens/Home";
import Login from "./screens/Login";

import firebaseApp from "./firebase/credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  async function getUserData(uid) {
    const docuRef = doc(firestore, `usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const infoFinal = docuCifrada.data();
    return {rol: infoFinal.rol, nombre: infoFinal.nombre }
  }
  

  function setUserWithFirebaseAndRol(usuarioFirebase) {
    getUserData(usuarioFirebase.uid).then((info) => {
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: info.rol,
        nombre: info.nombre,
       
      };
 
      setUser(userData);

    });
  }
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
  //     if (usuarioFirebase) {
  //       if (!user) {
  //         setUserWithFirebaseAndRol(usuarioFirebase);
  //       }
  //     } else {
  //       setUser(null);
  //       setLoading(false);
  //     }
  //   });

  //   // Cleanup subscription on unmount
  //   return () => unsubscribe();
  // }, [user]);

  // if (loading) {
  //   return <div>Cargando...</div>;
  // }
  
  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      if (!user) {
        setUserWithFirebaseAndRol(usuarioFirebase);

      }
    } else {
      setUser(null);
    }


  });

  return <>{user ? <Home user={user} /> : <Login />}</>;
}

export default App;
