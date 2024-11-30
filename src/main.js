// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router/index'
// import firebase from 'firebase'

// VueElementVue.config.productionTip = false;

// let app=null;
// firebase.auth().onAuthStateChanged()(()=>{

//     if(!app){
//         new VueElementVue({
//             router,
//             render:h=> h(App)
//         }).$mount('#app')
//     }
// })

// createApp(App).use(router).mount('#app')

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/init'; // Importa Firestore desde tu configuración
import { createAdmin } from '@/utils/adminSetup'; // Importa la función para crear un admin (opcional)

// Variable para controlar si la app ya ha sido montada
let app = null;

// Crea un administrador inicial (opcional, solo durante el desarrollo)
createAdmin('admin@administrador.com', 'administrador'); // Usa credenciales solo para desarrollo

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      // Obtén el rol del usuario desde Firestore
      const userRef = doc(db, 'users', user.uid); // Referencia al documento del usuario
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        user.role = userData.role; // Añade el rol al objeto `user`
        console.log(`Usuario autenticado: ${user.email}, Rol: ${user.role}`);
      } else {
        console.warn('No se encontró el documento del usuario en Firestore');
      }
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
    }
  }

  // Monta la aplicación si aún no se ha montado
  if (!app) {
    app = createApp(App).use(router).mount('#app');
  }
});


