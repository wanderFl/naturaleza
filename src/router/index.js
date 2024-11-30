import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import AuthLogin from '@/views/Auth/Login.vue';
import AuthRegister from '@/views/Auth/Register.vue';
import AuthDashboard from '@/views/Dashboard.vue';
import AdminView from '@/views/Auth/AdminView.vue';
import { getAuth } from 'firebase/auth'; // Autenticación de Firebase
import { doc, getDoc } from 'firebase/firestore'; // Firestore para obtener roles
import { db } from '@/firebase/init'; // Conexión a Firebase Firestore

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: AuthLogin,
  },
  {
    path: '/register',
    name: 'register',
    component: AuthRegister,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: AuthDashboard,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: {
      requireAuth: true,
      adminOnly: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware global para manejar las restricciones de las rutas
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some((route) => route.meta.requireAuth)) {
    if (!user) {
      // Si no está autenticado, redirige al login
      next({ name: 'login' });
    } else {
      // Verifica si la ruta requiere ser administrador
      if (to.matched.some((route) => route.meta.adminOnly)) {
        try {
          // Obtiene los datos del usuario desde Firestore
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();

            // Permitir acceso si el rol es 'admin'
            if (userData.role === 'admin') {
              next();
            } else {
              console.warn('Acceso denegado: El usuario no es administrador.');
              next({ name: 'dashboard' }); // Redirige al Dashboard si no es admin
            }
          } else {
            console.warn('No se encontró el documento del usuario en Firestore.');
            next({ name: 'dashboard' }); // Redirige al Dashboard si no se encuentra
          }
        } catch (error) {
          console.error('Error al verificar el rol del usuario:', error);
          next({ name: 'dashboard' }); // Redirige al Dashboard en caso de error
        }
      } else {
        // Si no requiere ser administrador, permite el acceso
        next();
      }
    }
  } else {
    // Si no requiere autenticación, permite el acceso
    next();
  }
});

export default router;
