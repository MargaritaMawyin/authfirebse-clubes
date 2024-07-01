import React, { useContext,useState } from "react";

import firebaseApp from "../firebase/credenciales";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const auth = getAuth(firebaseApp);

 

function Login() {
  const firestore = getFirestore(firebaseApp);
  const [isRegistrando, setIsRegistrando] = useState(false);

  async function registrarUsuario(email, password, rol, nombre,club) {
    const infoUsuario = await createUserWithEmailAndPassword(
      auth,
      email,
      password, 
      nombre,
      club
    ).then((usuarioFirebase) => {
      console.log('usuarioFirebase: ' + usuarioFirebase)
      return usuarioFirebase;
    });

    console.log("infoUsuario.user.uid: " + infoUsuario.user.uid);

    const docuRef = doc(firestore, `usuarios/${infoUsuario.user.uid}`);
    setDoc(docuRef, { correo: email, rol: rol, nombre: nombre, club: club });
  }

  /*--- funciones temporalmente en desuso ----- */
  async function updateUsuario(usuario) {
    const cambiosUser = doc(firestore, `usuarios/${usuario}`);
    await updateDoc(cambiosUser, { rol: "admin" });
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Correo de restablecimiento de contraseña enviado");
    } catch (error) {
      console.error("Error al enviar el correo de restablecimiento:", error);
      alert("Error al enviar el correo de restablecimiento");
    }
  }
  async function eliminarUser() {
    const miUser = doc(firestore, 'usuarios', 'cUKk1yDJapfr0YF4nJtbnTlfTf42');
    await deleteDoc(miUser);
  }

  async function eliminarUser2() {
    const miUser = doc(firestore, `usuarios/EXg4EdytR5PhJwl5zYQoFRRb7YR2`);
    await updateDoc(miUser, { deleted: true });
  }

/* ------------------------------- */



 

  function submitHandler(e) {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const rol = e.target.elements.rol.value;
    const nombre = e.target.elements.nombre.value;
    const club = e.target.elements.club.value;

    console.log("submit", email, password, rol, nombre);

    if (isRegistrando) {
  // REGISTRA CORREO, CONTRASEÑA, ROL, NOMBRE Y CLUB    
      registrarUsuario(email, password, rol, nombre, club);
    } else {
      signInWithEmailAndPassword(auth, email, password);
    }
  }

 

  return (
    <div>
      <h1>{isRegistrando ? "Regístrate" : "Inicia sesión"}</h1>

      <form onSubmit={submitHandler}>
        <label>
          Correo electrónico:
          <input type="email" id="email" />
        </label>

        <label>
          Contraseña:
          <input type="password" id="password" />
        </label>

        <label>
          Rol:
          <select id="rol">
            <option value="admin">Administrador</option>
            <option value="user">Representante</option>
          </select>
        </label>

        <label>
          Nombre:
          <input type="text" id="nombre" />
        </label>
        <label>
          Club:
          <input type="text" id="club" />
        </label>

        <input
          type="submit"
          value={isRegistrando ? "Registrar" : "Iniciar sesión"}
        />
      </form>

      <button onClick={() => setIsRegistrando(!isRegistrando)}>
        {isRegistrando ? "Ya tengo una cuenta" : "Quiero registrarme"}
      </button>

      {/* <button onClick={() => updateUsuario()}> CAMBIAR</button> */}

      {/* <button onClick={() => eliminarUser()}> ELIMINAR 1</button> */}

      {/* <button onClick={() => eliminarUser2()}> ELIMINAR 2</button> */}
    </div>
  );
}

export default Login;
