<template>
    <section class="section">
      <div class="container">
        <h1 class="title has-text-centered">Gestión de Datos - Admin</h1>
  
        <!-- Botones de Crear y Editar -->
        <div class="buttons is-right">
          <button class="button is-primary" @click="toggleCreateMode">
            {{ isCreating ? "Cancelar" : "Crear Nuevo Dato" }}
          </button>
          <button class="button is-warning" @click="toggleEditMode">
            {{ isEditing ? "Terminar Edición" : "Editar Datos" }}
          </button>
        </div>
  
        <!-- Formulario de creación -->
        <div v-if="isCreating" class="box">
          <h2 class="title is-4">Agregar Nuevo Dato</h2>
          <form @submit.prevent="createData">
            <div class="field">
              <label class="label">Año</label>
              <div class="control">
                <input v-model="newData.year" type="number" class="input" placeholder="Año" required />
              </div>
            </div>
            <div class="field">
              <label class="label">Descripción</label>
              <div class="control">
                <input v-model="newData.description" type="text" class="input" placeholder="Descripción" required />
              </div>
            </div>
            <div class="field">
              <label class="label">Especies</label>
              <div class="control">
                <input v-model="newData.species" type="text" class="input" placeholder="Especies" />
              </div>
            </div>
            <div class="field">
              <label class="label">Nivel del Mar</label>
              <div class="control">
                <input v-model="newData.seaLevel" type="text" class="input" placeholder="Nivel del Mar" />
              </div>
            </div>
            <div class="field">
              <label class="label">CO2</label>
              <div class="control">
                <input v-model="newData.co2" type="text" class="input" placeholder="CO2" />
              </div>
            </div>
            <div class="control">
              <button class="button is-success">Guardar</button>
            </div>
          </form>
        </div>
  
        <!-- Tabla de datos con edición y eliminación -->
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Año</th>
              <th>Descripción</th>
              <th>Especies</th>
              <th>Nivel del Mar</th>
              <th>CO2</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in yearsData" :key="data.id">
              <td>{{ data.year }}</td>
              <td>
                <template v-if="isEditing">
                  <input v-model="data.description" class="input is-small" />
                </template>
                <template v-else>
                  {{ data.description }}
                </template>
              </td>
              <td>
                <template v-if="isEditing">
                  <input v-model="data.species" class="input is-small" />
                </template>
                <template v-else>
                  {{ data.species }}
                </template>
              </td>
              <td>
                <template v-if="isEditing">
                  <input v-model="data.seaLevel" class="input is-small" />
                </template>
                <template v-else>
                  {{ data.seaLevel }}
                </template>
              </td>
              <td>
                <template v-if="isEditing">
                  <input v-model="data.co2" class="input is-small" />
                </template>
                <template v-else>
                  {{ data.co2 }}
                </template>
              </td>
              <td>
                <button class="button is-success is-small" @click="updateData(data)">
                  Guardar
                </button>
                <button class="button is-danger is-small" @click="deleteData(data.id)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </template>
  
  <script>
  import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
  import { db } from "@/firebase/init";
  
  export default {
    name: "AdminView",
    data() {
      return {
        yearsData: [], // Datos desde Firebase
        isCreating: false, // Modo de creación
        isEditing: false, // Modo de edición
        newData: {
          year: "",
          description: "",
          species: "",
          seaLevel: "",
          co2: "",
        },
      };
    },
    async created() {
      await this.fetchYearsData();
    },
    methods: {
      async fetchYearsData() {
        try {
          const querySnapshot = await getDocs(collection(db, "yearsData"));
          this.yearsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      },
      toggleEditMode() {
        this.isEditing = !this.isEditing;
      },
      toggleCreateMode() {
        this.isCreating = !this.isCreating;
      },
      async updateData(data) {
        const dataRef = doc(db, "yearsData", data.id);
        try {
          await updateDoc(dataRef, {
            description: data.description,
            species: data.species,
            seaLevel: data.seaLevel,
            co2: data.co2,
          });
          alert("Datos actualizados exitosamente");
        } catch (error) {
          console.error("Error al actualizar los datos:", error);
        }
      },
      async createData() {
        try {
          await addDoc(collection(db, "yearsData"), this.newData);
          alert("Nuevo dato agregado exitosamente");
          this.newData = { year: "", description: "", species: "", seaLevel: "", co2: "" };
          this.isCreating = false;
          await this.fetchYearsData();
        } catch (error) {
          console.error("Error al agregar nuevo dato:", error);
        }
      },
      async deleteData(id) {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este dato?");
        if (confirmDelete) {
          try {
            await deleteDoc(doc(db, "yearsData", id));
            alert("Dato eliminado exitosamente");
            await this.fetchYearsData();
          } catch (error) {
            console.error("Error al eliminar el dato:", error);
          }
        }
      },
    },
  };
  </script>
  