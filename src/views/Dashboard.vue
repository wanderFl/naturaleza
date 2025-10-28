<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">Cambios en la Naturaleza a lo largo de los años</h1>

      <!-- Filtro por rango de años -->
      <div class="field has-addons has-text-centered is-justify-content-center">
        <div class="control">
          <input
            v-model.number="startYear"
            class="input"
            type="number"
            placeholder="Año inicial"
            min="1980"
            max="2022"
          />
        </div>
        <div class="control">
          <input
            v-model.number="endYear"
            class="input"
            type="number"
            placeholder="Año final"
            min="1980"
            max="2022"
          />
        </div>
        <div class="control">
          <button class="button is-info" @click="filterData">Filtrar</button>
        </div>
      </div>

      <!-- Botones de Crear y Editar (solo para admin) -->
      <div v-if="isAdmin" class="buttons is-right">
        <button class="button is-primary" @click="toggleCreateMode">
          {{ isCreating ? "Cancelar" : "Crear Nuevo Dato" }}
        </button>
        <button class="button is-warning" @click="toggleEditMode">
          {{ isEditing ? "Terminar Edición" : "Editar Datos" }}
        </button>
      </div>

      <!-- Formulario de creación (solo para admin) -->
      <div v-if="isAdmin && isCreating" class="box">
        <h2 class="title is-4">Agregar Nuevo Dato. Agregar datos nuevos</h2>
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

      <!-- Tabla para admin -->
      <table v-if="isAdmin" class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Año</th>
            <th>Descripción</th>
            <th>Especies</th>
            <th>Nivel del Mar</th>
            <th>CO2</th>
            <th v-if="isEditing">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in filteredYearsData" :key="data.id">
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
            <td v-if="isEditing">
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

      <!-- Sección de datos por año (para usuarios normales) -->
      <div v-for="(yearData, index) in filteredYearsData" :key="index" class="year-section">
        <h2 class="subtitle has-text-centered">Cambios en la Naturaleza: {{ yearData.year }}</h2>
        <div class="columns is-vcentered">
          <div class="column is-half">
            <figure class="image is-6by3">
              <img :src="yearData.image || '/placeholder-image.jpg'" :alt="'Naturaleza en ' + yearData.year" />
            </figure>
          </div>
          <div class="column is-half">
            <div class="box">
              <div class="content">
                <p>{{ yearData.description }}</p>
                <ul>
                  <li><strong>Especies:</strong> {{ yearData.species }}</li>
                  <li><strong>Nivel del mar:</strong> {{ yearData.seaLevel }}</li>
                  <li><strong>CO2:</strong> {{ yearData.co2 }}</li>
                  <li><strong>Capa de ozono:</strong> {{ yearData.ozone }}</li>
                  <li><strong>Otros:</strong> {{ yearData.others }}</li>
                </ul>
              </div>
              <div class="buttons">
                <button class="button is-danger" @click="toggleDetails(index)">
                  Posibles Consecuencias
                </button>
              </div>
              <div v-if="yearData.showConsequences" class="content">
                <h4><strong>Posibles Consecuencias:</strong></h4>
                <ul>
                  <li v-for="(consequence, i) in yearData.consequences" :key="i">
                    {{ consequence }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calcular reducción de CO2 -->
      <div class="section">
        <h2 class="title has-text-centered">Calcular Reducción de CO2</h2>
        <p class="has-text-centered">
          Selecciona un porcentaje para estimar la reducción de emisiones de CO2 y sus posibles beneficios ambientales.
        </p>
        <div class="field has-addons is-centered">
          <div class="control">
            <span class="select">
              <select v-model.number="reductionPercentage">
                <option disabled value="">Selecciona un porcentaje</option>
                <option :value="25">25%</option>
                <option :value="50">50%</option>
                <option :value="75">75%</option>
                <option :value="100">100%</option>
              </select>
            </span>
          </div>
          <div class="control">
            <button class="button is-success" @click="calculateCO2Reduction">
              Calcular Reducción
            </button>
          </div>
        </div>
        <div v-if="reductionMessage" class="box has-background-info-light">
          <p class="has-text-centered"><strong>{{ reductionMessage }}</strong></p>
        </div>

        <!-- Selección de año para comparación -->
        <div v-if="reductionMessage" class="field has-addons is-centered">
          <div class="control">
            <span class="select">
              <select v-model="selectedYearForComparison">
                <option disabled value="">Selecciona un año para comparar</option>
                <option v-for="(yearData, index) in filteredYearsData" :key="index" :value="yearData.year">
                  {{ yearData.year }}
                </option>
              </select>
            </span>
          </div>
          <div class="control">
            <button class="button is-primary" @click="compareCO2Reduction">
              Comparar con el Año Seleccionado
            </button>
          </div>
        </div>

        <!-- Mensaje de comparación -->
        <div v-if="comparisonMessage" class="box has-background-warning-light">
          <p class="has-text-centered"><strong>{{ comparisonMessage }}</strong></p>
        </div>
      </div>

      <!-- Beneficios y Consecuencias -->
      <div class="section">
        <h2 class="title has-text-centered">Impacto de nuestras decisiones</h2>
        <div class="buttons is-centered">
          <button class="button is-success" @click="calculateBenefits">
            Calcular Beneficios
          </button>
          <button class="button is-danger" @click="calculateConsequences">
            Calcular Consecuencias
          </button>
        </div>

        <div v-if="benefitMessage" class="box has-background-success-light">
          <p class="has-text-centered"><strong>{{ benefitMessage }}</strong></p>
        </div>

        <div v-if="consequenceMessage" class="box has-background-danger-light">
          <p class="has-text-centered"><strong>{{ consequenceMessage }}</strong></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/init.js";
import { getAuth } from "firebase/auth";

export default {
  name: "Dashboard",
  data() {
    return {
      yearsData: [], // Datos desde Firebase
      startYear: "", // Año inicial
      endYear: "", // Año final
      reductionPercentage: "", // Porcentaje de reducción de CO2
      currentCO2: 400, // CO2 actual en ppm (valores simulados)
      reductionMessage: "", // Mensaje de resultado
      benefitMessage: "", // Mensaje de beneficios
      consequenceMessage: "", // Mensaje de consecuencias
      comparisonMessage: "", // Mensaje de comparación
      selectedYearForComparison: null, // Año seleccionado para la comparación
      isAdmin: false, // Verificar si el usuario es admin
      isEditing: false, // Modo de edición
      isCreating: false, // Modo de creación
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
    await this.checkAdmin();
  },
  computed: {
    filteredYearsData() {
      return this.yearsData.filter((data) => {
        const year = data.year;
        if (this.startYear && this.endYear) {
          return year >= this.startYear && year <= this.endYear;
        } else if (this.startYear) {
          return year >= this.startYear;
        } else if (this.endYear) {
          return year <= this.endYear;
        }
        return true;
      });
    },
  },
  methods: {
    async checkAdmin() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.isAdmin = userData.role === "admin"; // Solo admin puede editar
        }
      }
    },
    async fetchYearsData() {
      try {
        const querySnapshot = await getDocs(collection(db, "yearsData"));
        this.yearsData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            showConsequences: false,
          }))
          .sort((a, b) => a.year - b.year);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    },
    filterData() {
      // La lógica del filtrado es reactiva mediante computed
    },
    toggleDetails(index) {
      this.yearsData[index].showConsequences =
        !this.yearsData[index].showConsequences;
    },
    calculateBenefits() {
      this.benefitMessage = "Si reducimos las emisiones de CO2 hoy, para dentro de 10 años, el nivel del mar disminuirá su ritmo de aumento, los ecosistemas se estabilizarán y la calidad del aire será mucho mejor para todos. ¡Actuar a tiempo salva vidas y protege nuestro futuro!";
      this.consequenceMessage = ""; // Limpia el mensaje de consecuencias
    },
    calculateConsequences() {
      this.consequenceMessage = "Si no actuamos ahora, en 10 años podríamos enfrentar una pérdida masiva de biodiversidad, aumento catastrófico del nivel del mar, fenómenos climáticos extremos más frecuentes y un impacto irreversible en nuestra calidad de vida. ¡Es hora de actuar!";
      this.benefitMessage = ""; // Limpia el mensaje de beneficios
    },
    calculateCO2Reduction() {
      if (!this.reductionPercentage) {
        this.reductionMessage = "Por favor selecciona un porcentaje de reducción.";
        return;
      }

      const years = 10; // Años a estimar
      const reducedCO2 = this.currentCO2 * (1 - this.reductionPercentage / 100) ** years;

      let specificMessage;
      switch (this.reductionPercentage) {
        case 25:
          specificMessage = "Un 25% de reducción anual daría un inicio esperanzador hacia un futuro más limpio.";
          break;
        case 50:
specificMessage = "Con un 50% menos de emisiones, podríamos evitar desastres climáticos mayores.";
break;
case 75:
specificMessage = "Reducir un 75% las emisiones significaría un avance crítico para salvar el planeta.";
break;
case 100:
specificMessage = "Eliminando el 100% de las emisiones actuales, alcanzaríamos un equilibrio ambiental.";
break;
}this.reductionMessage = `Actualmente, el nivel de CO2 es de ${this.currentCO2} ppm. Si reducimos las emisiones en un ${this.reductionPercentage}% anual durante ${years} años, el nivel estimado de CO2 sería de ${reducedCO2.toFixed(2)} ppm. ${specificMessage}`;
},
compareCO2Reduction() {
  if (!this.selectedYearForComparison) {
    this.comparisonMessage = "Por favor selecciona un año para comparar.";
    return;
  }

  // Encuentra los datos del año seleccionado para la comparación
  const yearData = this.filteredYearsData.find(
    (data) => data.year === this.selectedYearForComparison
  );

  if (yearData) {
    const reducedCO2 = this.currentCO2 * (1 - this.reductionPercentage / 100) ** 10;
    const reductionDifference = this.currentCO2 - reducedCO2;

    let message = `Comparando el año ${this.selectedYearForComparison} con el presente:\n\n`;

    // Compara los niveles de CO2
    message += `- **CO2**: En ${this.selectedYearForComparison}, el nivel era ${yearData.co2}. Con una reducción del ${this.reductionPercentage}% anual, el nivel proyectado en 10 años sería de ${reducedCO2.toFixed(2)}. Esto implica una reducción acumulada de ${reductionDifference.toFixed(2)} ppm.\n`;

    // Si hay datos de especies, añádelos al mensaje
    if (yearData.species && yearData.species !== "Desconocido" && yearData.species !== "") {
      message += `- **Especies**: En ${this.selectedYearForComparison}, había ${yearData.species} de las especies registradas. Con la reducción de CO2, se estima que podríamos proteger al menos un ${this.reductionPercentage}% adicional de estas especies.\n`;
    }

    // Si hay datos de nivel del mar, añádelos al mensaje
    if (yearData.seaLevel && yearData.seaLevel !== "Desconocido" && yearData.seaLevel !== "") {
      message += `- **Nivel del mar**: En ${this.selectedYearForComparison}, el nivel del mar aumentaba ${yearData.seaLevel} por año. Con menos emisiones, el ritmo de aumento podría disminuir significativamente.\n`;
    }

    // Si hay datos de capa de ozono, añádelos al mensaje
    if (yearData.ozone && yearData.ozone !== "Desconocido" && yearData.ozone !== "") {
      message += `- **Capa de ozono**: En ${this.selectedYearForComparison}, la capa de ozono estaba afectada en ${yearData.ozone}. La reducción de CO2 contribuiría a su recuperación.\n`;
    }

    // Si hay otros datos adicionales, añádelos al mensaje
    if (yearData.others && yearData.others !== "Desconocido" && yearData.others !== "") {
      message += `- **Otros**: ${yearData.others}\n`;
    }

    // Asignamos el mensaje final de comparación
    this.comparisonMessage = message;
  }
},
toggleEditMode() {
  this.isEditing = !this.isEditing;
},
toggleCreateMode() {
  this.isCreating = !this.isCreating;
},
async updateData(data) {
  if (!this.isAdmin) return;
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
    await this.fetchYearsData(); // Recargar datos
  } catch (error) {
    console.error("Error al agregar nuevo dato:", error);
  }
},
async deleteData(id) {
  if (!this.isAdmin) return;
  const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este dato?");
  if (confirmDelete) {
    try {
      await deleteDoc(doc(db, "yearsData", id));
      alert("Dato eliminado exitosamente");
      await this.fetchYearsData(); // Actualizar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar el dato:", error);
    }
  }
},},
};
</script>
<style>
.year-section {
  margin-bottom: 3rem;
}
.has-background-info-light {
  background-color: hsl(129.6deg 41.98% 47.92%) !important;
}
.has-background-warning-light {
  background-color: hsl(42deg 71.48% 56.39%) !important;
}
.has-background-success-light {
  background-color: hsl(153deg 47.88% 55.58%) !important;
}
.has-background-danger-light {
  background-color: hsl(348deg 59.8% 61.19%) !important;
}

.year-section .image img {
  border-radius: 8px;
}
.table {
  margin-top: 2rem;
}
</style>