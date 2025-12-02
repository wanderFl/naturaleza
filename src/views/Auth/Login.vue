<template>
  <div class="container" mt-50>
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <h3 class="title is-3">Iniciar Sesión</h3>

        <!-- 🔥 Si el flag está apagado, mostramos mensaje -->
        <div v-if="!loginEnabled" class="notification is-warning">
          🚫 El inicio de sesión está deshabilitado temporalmente.
        </div>

        <!-- 🔥 Formulario solo si el flag está prendido -->
        <form v-if="loginEnabled" @submit.prevent="login">
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input 
                class="input" 
                type="email" 
                placeholder="e.g. alexsmith@gmail.com" 
                v-model="email"
                autocomplete="email"
                required
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Contraseña</label>
            <div class="control">
              <input 
                class="input" 
                type="password" 
                v-model="password"
                autocomplete="current-password"
                required
              />
            </div>
          </div>

          <button type="submit" class="button is-primary">Iniciar Sesión</button>
        </form>

        <!-- Mensaje de error normal -->
        <div class="notification is-danger mt-10" v-if="error">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '@/firebase/init';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getCurrentInstance } from 'vue';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      user: null,
      loginEnabled: true,  // ← controlado por LaunchDarkly
    };
  },

  async mounted() {
    try {
      // obtener LaunchDarkly desde main.js
      const ld = getCurrentInstance()?.appContext?.config?.globalProperties?.$ldClient;

      if (!ld) {
        // LaunchDarkly no configurado, login habilitado por defecto
        this.loginEnabled = true;
        return;
      }

      // Esperar a que esté listo (con timeout de 3 segundos)
      await ld.waitForInitialization(3);

      // obtener valor inicial del flag
      this.loginEnabled = ld.variation("allow-login", true);

      // escuchar cambios del flag en tiempo real
      ld.on("change:allow-login", (newValue) => {
        this.loginEnabled = newValue;
      });
    } catch (err) {
      // Si hay error, habilitar login por defecto
      this.loginEnabled = true;
    }
  },

  name: 'Login',

  methods: {
    login() {
      if (!this.loginEnabled) {
        this.error = "🚫 El inicio de sesión está deshabilitado.";
        return;
      }

      if (this.email && this.password) {
        signInWithEmailAndPassword(auth, this.email, this.password)
          .then((result) => {
            this.user = result.user;
            this.$router.push({ name: 'dashboard' });
          })
          .catch((err) => {
            this.error = err.message;
          });
      } else {
        this.error = 'Todos los campos son requeridos';
      }
    },
  },
};
</script>

<style scoped>
.mt-50 {
  margin-top: 50px;
}

.mt-10 {
  margin-top: 10px;
}
</style>