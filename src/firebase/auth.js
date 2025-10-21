// src/firebase/auth.js
import { getAuth } from 'firebase/auth';
import { firebaseApp } from './init';

// Inicializa Auth
const auth = getAuth(firebaseApp);

export { auth };
