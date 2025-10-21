<template>
    <div>
      <h2>Asignar Rol</h2>
      <form @submit.prevent="assignRole">
        <div>
            <input v-model="uid" placeholder="UID del Usuario" />
            <input v-model="role" placeholder="Rol a Asignar" />
            <button @click="assignRole">Asignar Rol</button>
        </div>
        <div>
          <label for="role">Rol:</label>
          <input id="role" v-model="role" required />
        </div>
        <button type="submit">Asignar Rol</button>
      </form>
      <p v-if="successMessage">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  import { UserService } from '@/services/UserService';
  
  export default {
    data() {
      return {
        uid: '',
        role: '',
        successMessage: '',
      };
    },
    methods: {
      async assignRole() {
        try {
          await UserService.assignRole(this.uid, this.role);
          this.successMessage = `Rol '${this.role}' asignado al usuario con UID: ${this.uid}`;
          this.uid = '';
          this.role = '';
        } catch (error) {
          console.error('Error al asignar rol:', error);
        }
      },
    },
  };
  </script>
  