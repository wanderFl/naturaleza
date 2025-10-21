// src/firebase/firestore.js
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from './init';

// Inicializa Firestore
const db = getFirestore(firebaseApp);

export { db };
