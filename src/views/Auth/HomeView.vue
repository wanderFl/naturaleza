<template>
    <div class="container">
      <h1>Lista de Empleados</h1>
      <ul>
        <li v-for="empleado in empleados" :key="empleado.id">
          {{ empleado.nombre }} - {{ empleado.cargo }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        empleados: []
      };
    },
    mounted() {
      this.obtenerEmpleados();
    },
    methods: {
      async obtenerEmpleados() {
        try {
          const respuesta = await axios.get("http://localhost:3000/empleados");
          this.empleados = respuesta.data;
        } catch (error) {
          console.error("Error al obtener empleados:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  </style>
  