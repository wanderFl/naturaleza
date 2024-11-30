import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';  // Importar auth
import { assignRole } from '@/firebase/init';  // Asegúrate de que tienes la función `assignRole` en init.js

// Función para crear un administrador
export const createAdmin = async (email, password) => {
  const auth = getAuth();  // Asegúrate de inicializar `auth`
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Asignar rol de administrador
    await assignRole(user.uid, 'admin');
    console.log('Administrador creado exitosamente');
  } catch (error) {
    console.error('Error creando administrador:', error);
  }
};


createAdmin('admin@administrador.com', 'administrador');
