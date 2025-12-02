import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';

// 👉 IMPORTAMOS LaunchDarkly
import { initLaunchDarkly, getLDClient } from '@/launchdarklyClient';

// Variable para controlar si la app ya ha sido montada
let app = null;

// NOTA: El admin ya fue creado. Para crear uno nuevo, descomentar la siguiente línea:
// import { createAdmin } from '@/utils/adminSetup';
// createAdmin('admin@administrador.com', 'administrador');

async function bootstrap() {
  console.log("🚀 Bootstrap iniciando...");

  // 👉 Inicializar LaunchDarkly ANTES de Firebase
  try {
    await initLaunchDarkly();
  } catch (err) {
    // LaunchDarkly no es crítico, la app continúa
    console.info("ℹ️ LaunchDarkly no configurado - app funciona normalmente");
  }

  // 👉 Después, esperar Firebase como siempre
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          user.role = userData.role; 
          console.log(`Usuario autenticado: ${user.email}, Rol: ${user.role}`);
        } else {
          console.warn('No se encontró el documento del usuario en Firestore');
        }
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
      }
    }

    // 👉 Montar la app una sola vez
    if (!app) {
      app = createApp(App)
        .use(router);

      // 👉 Hacer LaunchDarkly accesible en todos los componentes
      const ldClient = getLDClient();
      app.config.globalProperties.$ldClient = ldClient;
      console.log("🔗 LaunchDarkly client disponible globalmente:", !!ldClient);

      app.mount('#app');
      console.log("✅ App montada");
    }
  });
}

// Ejecutar bootstrap
bootstrap();