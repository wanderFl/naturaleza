<!-- eslint-disable vue/multi-word-component-names

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link class="navbar-item" to="/">
            <h3 class="title is-3">Naturaleza</h3>
          </router-link>
    
          <a role="button" class="navbar-burger" :class="{'is-active':isOpen}" @click.prevent="toggleMenu" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      
        <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active':isOpen}">
          <div class="navbar-start">
            <router-link class="navbar-item" to="/">
              Home
            </router-link>
          </div>
      
          <div class="navbar-end">
            <div class="navbar-item">
                <template v-if="user">
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                        {{ user.displayName || user.email }}
                        </a>
                        <div class="navbar-dropdown">
                          <router-link class="navbar-item" to="/dashboard">
                            Dashboard
                          </router-link>
                          <a class="navbar-item is-selected" @click.prevent="logout">
                            Cerrar Sesión
                          </a>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="buttons">
                        <router-link class="button is-primary" to="/register">
                          <strong>Registrarse</strong>
                        </router-link>
                        <router-link class="button is-light" to="/login">
                          Iniciar Sesión
                        </router-link>
                    </div>                
                </template>
            </div>
          </div>
        </div>
      </nav>
    </template>
    
    <script>
    import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
    
    export default {
        data() {
            return {
                isOpen: false,
                user: null
            };
        },
        methods: {
            toggleMenu() {
                this.isOpen = !this.isOpen;
            },
            logout() {
                const auth = getAuth();
                signOut(auth).then(() => {
                    this.$router.push({ name: 'login' });
                });
            }
        },
        created() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                this.user = user ? user : null;
            });
        }
    };
    </script>
    
 -->

 <template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <h3 class="title is-3">Naturaleza</h3>
      </router-link>

      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': isOpen }"
        @click.prevent="toggleMenu"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="navbarBasicExample"
      class="navbar-menu"
      :class="{ 'is-active': isOpen }"
    >
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">Home</router-link>
        <router-link class="navbar-item" to="/dashboard">Dashboard</router-link>
        <!-- Mostrar Admin Panel solo si el usuario tiene rol admin -->
        <template v-if="user && user.role === 'admin'">
          <router-link class="navbar-item" to="/admin">Admin Panel</router-link>
        </template>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <template v-if="user">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                {{ user.displayName || user.email }}
              </a>
              <div class="navbar-dropdown">
                <router-link class="navbar-item" to="/dashboard">
                  Dashboard
                </router-link>
                <a class="navbar-item is-selected" @click.prevent="logout">
                  Cerrar Sesión
                </a>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="buttons">
              <router-link class="button is-primary" to="/register">
                <strong>Registrarse</strong>
              </router-link>
              <router-link class="button is-light" to="/login">
                Iniciar Sesión
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/init";

export default {
  data() {
    return {
      isOpen: false,
      user: null,
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.$router.push({ name: "login" });
      });
    },
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Obtener el rol del usuario desde Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.user = { ...user, role: userData.role }; // Asignar rol al usuario
        } else {
          console.warn("No se encontró el documento del usuario en Firestore");
          this.user = user;
        }
      } else {
        this.user = null;
      }
    });
  },
};
</script>

<style scoped>
.navbar {
  background-color: #356d2d;
  padding: 1rem;
}
.navbar-burger {
  color: #4a4a4a;
}
</style>
