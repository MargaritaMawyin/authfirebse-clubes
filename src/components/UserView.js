import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/credenciales";
import { getAuth,updatePassword, EmailAuthProvider, reauthenticateWithCredential  } from "firebase/auth";

import { getFirestore, doc, setDoc, getDoc ,getDocs, collection} from "firebase/firestore";
import { useAuth } from '../screens/Login'
const auth = getAuth(firebaseApp);

function UserView() {
  const [clubs, setClubs] = useState([]);

  const firestore = getFirestore(firebaseApp);
  function submitHandler(e) {
    e.preventDefault();

    const nombre_club = e.target.elements.nombre_club.value;
    const ruc = e.target.elements.ruc.value;
    const presidente = e.target.elements.presidente.value;
    const delegado = e.target.elements.delegado.value;
    const provincia = e.target.elements.provincia.value;
    const ciudad = e.target.elements.ciudad.value;
    const telefono = e.target.elements.telefono.value;
    const registro_directorio = e.target.elements.registro_directorio.files[0];
    const acuerdo_ministerial = e.target.elements.acuerdo_ministerial.files[0];
    const correo = e.target.elements.correo.value;
    const estado = e.target.elements.estado.value;

    console.log(
      "submit",
      nombre_club,
      ruc,
      presidente,
      delegado,
      provincia,
      ciudad,
      telefono,
      registro_directorio,
      acuerdo_ministerial,
      correo,
      estado
    );

    const nuevoClub = doc(firestore, `clubes/${nombre_club}`);
    setDoc(nuevoClub, {
      ruc: ruc,
      presidente: presidente,
      delegado: delegado,
      provincia: provincia,
      ciudad: ciudad,
      telefono: telefono,
      registro_directorio:registro_directorio.name,
      acuerdo_ministerial:acuerdo_ministerial.name,
      correo: correo,
      estado: estado
    });
  }
  const [pdfFile, setPdfFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Por favor, sube un archivo PDF válido.");
      setPdfFile(null);
    }
  };
/* DADO EL NOMBRE DEL CLUB TRAE LOS DATOS DE ESE CLUB  */
  async function getClubes(nombre_club) {
    const club = doc(firestore, "clubes", nombre_club);
    const clubb = await getDoc(club);
    if (clubb.exists()) {
      console.log("CLUB data:", clubb.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such CLUB!");
    }
  }

  /* MUESTRA TODOS LOS CLUBES EN LA PANTALLA */
  async function getAllClubes() {
    const clubesCollection = collection(firestore, "clubes");
    const clubesSnapshot = await getDocs(clubesCollection);
    const clubesList = clubesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClubs(clubesList);
  }
  /* --------------------------------------------------------------------- */

/* 2 FUNCIONES PARA CAMBIAR LA CONTRASEÑA LUEGO 
HAY QUE INTRODUCIR MAIL Y CONTRASEÑA ACUTALES PARA COMBIAR DE CONTRASEÑA */
  async function cambiarPassword(nuevaPassword) {
    const user = auth.currentUser;
    console.log(user.email)
  
    if (user) {
      try {
        await updatePassword(user, nuevaPassword);
        alert("Contraseña actualizada correctamente");
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Error al actualizar la contraseña");
      }
    } else {
      alert("No hay usuario autenticado");
    }
  }
  

  
  async function reauthenticateUser(email, currentPassword) {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, currentPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      alert("Reautenticación exitosa");
      return true;
    } catch (error) {
      console.error("Error al reautenticar el usuario:", error);
      alert("Error al reautenticar el usuario");
      return false;
    }
  }
/* --------------------------------------------------------------------- */
  useEffect(() => {
    getAllClubes();
  }, []);
  return (
  
    
    <div>
       <button onClick={async () => {
        const email = prompt("Introduce tu correo electrónico:");
        const currentPassword = prompt("Introduce tu contraseña actual:");
        const nuevaPassword = prompt("Introduce la nueva contraseña:");
        const reauthenticated = await reauthenticateUser(email, currentPassword);
        if (reauthenticated && nuevaPassword) {
          cambiarPassword(nuevaPassword);
        }
      }}>Cambiar Contraseña</button>
     

      <h1>Listado de clubes</h1>
      <button onClick={() => getClubes(prompt("Introduce el nombre del club:"))}>
        Ver club
      </button>
      <ul>
        {clubs.map((club) => (
          <li key={club.id}>
            {club.id}: {JSON.stringify(club)}
          </li>
        ))}
      </ul>
      {pdfFile && (
        <div>
          <h2>Archivo Seleccionado:</h2>
          <p>{pdfFile.name}</p>
        </div>
      )}
    </div>
  );
}

export default UserView;
