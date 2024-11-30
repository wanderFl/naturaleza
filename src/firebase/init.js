// // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";

// import firebase from 'firebase'
// import firestore from 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: "AIzaSyCPVpcvnWaA9rlAtT7EiFVm3Cin_MDlZFE",
//   authDomain: "proyectobd-b61d9.firebaseapp.com",
//   projectId: "proyectobd-b61d9",
//   storageBucket: "proyectobd-b61d9.firebasestorage.app",
//   messagingSenderId: "503938430958",
//   appId: "1:503938430958:web:8fb5b6185bb8f1df9380ff",
//   measurementId: "G-BP6DZR4E0Z"
// };

// const firebaseApp = firebase.initializeApp(firebaseConfig);
// firebaseApp.firestore().settings({timestampsInSnapshots: true});

// export default firebaseApp.firestore();

// // const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);



// init.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCPVpcvnWaA9rlAtT7EiFVm3Cin_MDlZFE",
  authDomain: "proyectobd-b61d9.firebaseapp.com",
  projectId: "proyectobd-b61d9",
  storageBucket: "proyectobd-b61d9.appspot.com",
  messagingSenderId: "503938430958",
  appId: "1:503938430958:web:8fb5b6185bb8f1df9380ff",
  measurementId: "G-BP6DZR4E0Z"
};

// Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Inicializa Firestore y Auth
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Función para asignar roles
export const assignRole = async (uid, role) => {
  try {
    const userRef = doc(db, 'users', uid); // Referencia al documento del usuario en Firestore
    await setDoc(userRef, { role }, { merge: true }); // Asigna el rol al usuario
    console.log(`Rol '${role}' asignado al usuario con UID: ${uid}`);
  } catch (error) {
    console.error('Error al asignar rol:', error);
    throw error;
  }
};

export { db, auth };
