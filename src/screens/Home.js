import React from "react";

import AdminView from "../components/AdminView";
import UserView from "../components/UserView";

import firebaseApp from "../firebase/credenciales";
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth(firebaseApp);

function Home({ user }) {
  return (
    <div>
      Home
      <h1>Bienvenido, {user.nombre}</h1>
      <p>Correo: {user.email}</p>
      <p>Rol: {user.rol}</p>
      <p>Nombre: {user.name}</p>
      console.log(user)

      <button onClick={() => signOut(auth)}> Cerrar sesión</button>
      {user.rol === "admin" ? <AdminView /> : <UserView />}
    </div>
  );
}

export default Home;
