// Importamos la función para inicializar la aplicación de Firebase
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN_bqoZkTdiDAP5wmmXCKv51vcvjnrbxA",
  authDomain: "login-prueba-30184.firebaseapp.com",
  projectId: "login-prueba-30184",
  storageBucket: "login-prueba-30184.appspot.com",
  messagingSenderId: "196957509384",
  appId: "1:196957509384:web:904ac3b7011ae6f4c2febd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Inicializamos la aplicación y la guardamos en firebaseApp
const firebaseApp = initializeApp(firebaseConfig);
// Exportamos firebaseApp para poder utilizarla en cualquier lugar de la aplicación
export default firebaseApp;
