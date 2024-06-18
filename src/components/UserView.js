import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/credenciales";

import { getFirestore, doc, setDoc, getDoc ,getDocs, collection} from "firebase/firestore";
import { useAuth } from '../screens/Login'

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
  async function getAllClubes() {
    const clubesCollection = collection(firestore, "clubes");
    const clubesSnapshot = await getDocs(clubesCollection);
    const clubesList = clubesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClubs(clubesList);
  }

 

  useEffect(() => {
    getAllClubes();
  }, []);
  return (
  
    <div>

      <h1>Ingreso de clubes</h1>
      <form onSubmit={submitHandler}>
      
        <label>
          Nombre del club:
          <input type="text" id="nombre_club" />
        </label>

        <label>
          RUC:
          <input type="text" id="ruc" />
        </label>

        <label>
          Presidente:
          <input type="text" id="presidente" />
        </label>

        <label>
          Delegado:
          <input type="text" id="delegado" />
        </label>

        <label>
          Provincia:
          <input type="text" id="provincia" />
        </label>

        <label>
          Ciudad:
          <input type="text" id="ciudad" />
        </label>

        <label>
          Telefono:
          <input type="text" id="telefono" />
        </label>

        <h1>Registro de directorio PDF</h1>

        <input
          type="file"
          name="registro_directorio"          accept="application/pdf"
          onChange={handleFileChange}
        />
        
        <h1>Acuerdo ministerial PDF</h1>

        <input
          type="file"
          name="acuerdo_ministerial"
          accept="application/pdf"
          onChange={handleFileChange}
        />
         <label>
          Correo:
          <input type="text" id="correo" />
        </label>
        <label>
          Estado:
          <input type="text" id="estado" />
        </label>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* <input type="submit" value="GUARDAR" /> */}
        {/* <button type="text" onClick={() => getClubes()}>
          ver club
        </button> */}
         <button type="submit" >
          Guardar club
        </button>
      
        {/* <button onClick={getClubes}>Ver clubes</button> */}
      </form>
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
