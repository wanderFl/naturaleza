import { db } from "@/firebase/init";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

const seedData = async () => {
  const yearsData = [
    {
        year: 1980,
        image: require("@/assets/nature.jpg"), // Asegúrate de que esta imagen esté en "@/assets/"
        description: "En 1980, el impacto de las actividades humanas en el medio ambiente se hacía más evidente.",
        species: "Incremento de especies en peligro debido a la deforestación.",
        seaLevel: "Nivel estable pero con indicios de futuras variaciones.",
        co2: "El CO2 alcanzó niveles previos al cambio climático masivo.",
        ozone: "Apenas comenzaban a detectarse los efectos de la industrialización.",
        others: "Deforestación y explotación masiva de recursos naturales.",
        consequences: [
          "Mayor deforestación impactó los ecosistemas.",
          "Especies en peligro de extinción.",
        ],
        showConsequences: false,
      },
      {
        year: 1987,
        image: require("@/assets/img1987.jpg"), 
        description: "En 1987, los efectos del cambio climático comenzaban a ser reconocidos globalmente.",
        species: "Numerosas especies enfrentaron peligro debido a la deforestación masiva.",
        seaLevel: "Aumento leve pero constante en comparación con décadas anteriores.",
        co2: "El CO2 alcanzó un promedio anual de 350 ppm.",
        ozone: "Se firmó el Protocolo de Montreal para abordar la reducción de CFC.",
        others: "Eventos climáticos extremos comenzaron a ser más comunes.",
        consequences: [
          "Creciente daño a la biodiversidad.",
          "Fenómenos climáticos más intensos.",
        ],
        showConsequences: false,
      },
    {
      year: 1994,
      image: require("@/assets/img1994.jpg"),
      description: "Los ecosistemas continuaban adaptándose al impacto humano.",
      species: "La pérdida de hábitats continuó afectando la biodiversidad.",
      seaLevel: "El nivel del mar aumentó ligeramente debido al deshielo polar.",
      co2: "Las emisiones de CO2 siguieron en aumento, alcanzando 358 ppm.",
      ozone: "Mejoras iniciales en la recuperación de la capa de ozono.",
      others: "Sequías y tormentas más severas comenzaron a registrarse globalmente.",
      consequences: [
        "Disminución drástica de hábitats naturales.",
        "Incremento en la migración de especies hacia nuevos ecosistemas.",
        "Mayor frecuencia de desastres naturales como huracanes y sequías.",
      ],
      showConsequences: false,
    },
    {
      year: 2001,
      image: require("@/assets/img2001.jpg"),
      description: "La evidencia científica del cambio climático se volvió irrefutable.",
      species: "Mayor riesgo de extinción para especies en regiones tropicales.",
      seaLevel: "Incremento notable en las costas de islas pequeñas.",
      co2: "Superó los 370 ppm, marcando un nuevo récord.",
      ozone: "Recuperación lenta pero estable gracias a medidas globales.",
      others: "Temperaturas globales más altas registradas hasta ese momento.",
      consequences: [
        "Riesgo de inundaciones en islas pequeñas debido al aumento del nivel del mar.",
        "Pérdida acelerada de biodiversidad en regiones tropicales.",
        "Impacto negativo en cultivos por temperaturas extremas.",
      ],
      showConsequences: false,
    },
    {
      year: 2008,
      image: require("@/assets/img2008.jpg"),
      description: "El cambio climático comenzó a ser un tema central en políticas internacionales.",
      species: "Esfuerzos de conservación ayudaron a estabilizar algunas poblaciones.",
      seaLevel: "El nivel del mar continuó su ascenso, afectando regiones costeras.",
      co2: "Las emisiones alcanzaron los 385 ppm.",
      ozone: "Se observaron signos claros de recuperación.",
      others: "Fenómenos como huracanes y tifones más intensos se hicieron comunes.",
      consequences: [
        "Mayor exposición de comunidades costeras a desastres naturales.",
        "Erosión de suelos agrícolas en regiones afectadas.",
        "Impacto económico por la reconstrucción tras desastres naturales.",
      ],
      showConsequences: false,
    },
    {
      year: 2015,
      image: require("@/assets/img2015.jpg"),
      description: "Se firmó el Acuerdo de París para combatir el cambio climático.",
      species: "El número de especies en peligro seguía siendo alarmante.",
      seaLevel: "El nivel del mar subió considerablemente, afectando regiones bajas.",
      co2: "Promedio de CO2 global alcanzó 400 ppm.",
      ozone: "Recuperación más evidente en la capa de ozono.",
      others: "Eventos climáticos extremos continuaron impactando a comunidades vulnerables.",
      consequences: [
        "Aumento de inundaciones en regiones bajas, desplazando poblaciones.",
        "Mayor inseguridad alimentaria debido a cambios en los patrones climáticos.",
        "Costo elevado de implementación de estrategias climáticas acordadas.",
      ],
      showConsequences: false,
    },
    {
      year: 2022,
      image: require("@/assets/img2022.jpg"),
      description: "La humanidad enfrenta retos urgentes para proteger el medio ambiente.",
      species: "Numerosos esfuerzos de conservación dieron resultados positivos.",
      seaLevel: "Las islas bajas enfrentan inundaciones frecuentes.",
      co2: "El CO2 llegó a niveles sin precedentes, superando los 415 ppm.",
      ozone: "La recuperación de la capa de ozono se consolidó significativamente.",
      others: "Impacto creciente del cambio climático en economías y sociedades.",
      consequences: [
        "Mayor frecuencia de eventos climáticos extremos afecta la infraestructura.",
        "Erosión costera en islas y ciudades cercanas al mar.",
        "Riesgo creciente para la salud humana debido al calentamiento global.",
      ],
      showConsequences: false,
    },
  ];

  // Referencia a la colección "yearsData" en Firestore
  const collectionRef = collection(db, "yearsData");

  // Se itera sobre el array de datos para añadir cada año a Firestore
  for (const year of yearsData) {
    try {
      // Se consulta si ya existe un documento para este año
      const q = query(collectionRef, where("year", "==", year.year)); // Filtra por el año específico
      const querySnapshot = await getDocs(q); // Ejecuta la consulta

      if (querySnapshot.empty) {
        // Si no existe el año en la base de datos, lo añade
        await addDoc(collectionRef, year);
        console.log(`Año ${year.year} añadido exitosamente.`); // Mensaje de éxito
      } else {
        // Si el año ya existe, no lo añade y muestra un mensaje
        console.log(`Año ${year.year} ya existe. No se añadirá.`);
      }
    } catch (error) {
      // Si ocurre algún error al añadir el dato, se muestra un mensaje de error
      console.error(`Error al añadir el año ${year.year}:`, error);
    }
  }
};

// Se exporta la función seedData para que pueda ser usada en otros lugares
export default seedData;
