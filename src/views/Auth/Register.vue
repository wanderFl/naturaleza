<template>
  <div class="container" mt-50>
      <div class="columns">
          <div class="column is-6 is-offset-3">
              <h3 class="title is-3">Crear una cuenta</h3>   
              <form action="#" @submit.prevent="register">
                  <div class="field">
                      <label class="label">Name</label>
                      <div class="control">
                          <input 
                            class="input" 
                            type="text" 
                            placeholder="e.g Alex Smith" 
                            v-model="name"
                            autocomplete="name"
                            required
                          >
                      </div>
                  </div>
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
                          >
                      </div>
                  </div>
  
                  <div class="field">
                      <label class="label">Contrasena</label>
                      <div class="control">
                          <input 
                            class="input" 
                            type="password" 
                            v-model="password"
                            autocomplete="new-password"
                            required
                          >
                      </div>
                  </div>
  
                  <button type="submit" class="button is-primary"> Registrarme </button>
              </form> 
  
              <div class="notification is-danger mt-10" v-if="error">
                  {{ error }}
              </div>
          </div>
      </div>
  </div>
  </template>
  
  <script>
  import { auth } from '@/firebase/init';
  import { assignRole } from '@/firebase/init';
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  
  export default {
      data() {
          return {
              name: '',
              email: '',
              password: '',
              error: '',
          };
      },
      name: 'Register',
      methods: {
          async register() {
              if (this.name && this.email && this.password) {
                  try {
                      // Crear usuario con correo y contraseña
                      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
                      const user = userCredential.user;
  
                      // Actualizar perfil del usuario con el nombre
                      await updateProfile(user, { displayName: this.name });
  
                      // Asignar rol de usuario por defecto
                      await assignRole(user.uid, 'user');
  
                      // Reiniciar campos del formulario y redirigir
                      this.name = '';
                      this.email = '';
                      this.password = '';
                      this.$router.push({ name: 'dashboard' });
                  } catch (err) {
                      this.error = err.message;
                  }
              } else {
                  this.error = 'Todos los campos son requeridos';
              }
          },
      },
  };
  </script>
  