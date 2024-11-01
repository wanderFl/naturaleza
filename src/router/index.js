import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import AuthLogin from '@/views/Auth/Login.vue'
import AuthRegister from '@/views/Auth/Register.vue'
import AuthDashboard from '@/views/Dashboard.vue'
import { getAuth } from 'firebase/auth' // Importa el módulo de autenticación

// Vue.use(router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: AuthLogin
  },
  {
    path: '/register',
    name: 'register',
    component: AuthRegister
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: AuthDashboard,
    meta:{
        requireAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
    const auth = getAuth(); // Obtén el objeto de autenticación
    if (to.matched.some(route => route.meta.requireAuth)) {
      const user = auth.currentUser;
      if (user) {
        next();
      } else {
        next({ name: 'login' });
      }
    } else {
      next();
    }
  });
export default router