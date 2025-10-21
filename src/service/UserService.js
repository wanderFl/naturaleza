// src/services/UserService.js
import { db } from '../firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

const UserService = {
  async assignRole(uid, role) {
    try {
      const userRef = doc(db, 'users', uid); // Referencia al documento del usuario
      await setDoc(userRef, { role }, { merge: true }); // Asignar rol
      console.log(`Rol '${role}' asignado al usuario con UID: ${uid}`);
    } catch (error) {
      console.error('Error al asignar rol:', error);
      throw error;
    }
  },
};

export { UserService };
