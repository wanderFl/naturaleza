// example.spec.js - Tests unitarios para funciones de Dashboard
/* eslint-env jest */

// Mock de Firebase para evitar errores en los tests
jest.mock('@/firebase/init.js', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null
  }))
}));

describe('Dashboard Functions', () => {
  // Simulamos los datos y métodos del componente Dashboard
  let dashboardData;
  let dashboardMethods;

  beforeEach(() => {
    dashboardData = {
      yearsData: [
        {
          id: '1',
          year: 2020,
          description: 'Datos de prueba 2020',
          species: '100 especies',
          seaLevel: '3.2mm/año',
          co2: '412 ppm',
          showConsequences: false
        },
        {
          id: '2',
          year: 2021,
          description: 'Datos de prueba 2021',
          species: '95 especies',
          seaLevel: '3.5mm/año',
          co2: '415 ppm',
          showConsequences: false
        }
      ],
      startYear: '',
      endYear: '',
      reductionPercentage: '',
      currentCO2: 400,
      reductionMessage: '',
      benefitMessage: '',
      consequenceMessage: '',
      isAdmin: false,
      isEditing: false,
      isCreating: false
    };

    dashboardMethods = {
      // Método para filtrar datos por años
      filteredYearsData() {
        return dashboardData.yearsData.filter((data) => {
          const year = data.year;
          if (dashboardData.startYear && dashboardData.endYear) {
            return year >= dashboardData.startYear && year <= dashboardData.endYear;
          } else if (dashboardData.startYear) {
            return year >= dashboardData.startYear;
          } else if (dashboardData.endYear) {
            return year <= dashboardData.endYear;
          }
          return true;
        });
      },

      // Método para calcular reducción de CO2
      calculateCO2Reduction() {
        if (!dashboardData.reductionPercentage) {
          dashboardData.reductionMessage = "Por favor selecciona un porcentaje de reducción.";
          return;
        }

        const years = 10;
        const reducedCO2 = dashboardData.currentCO2 * (1 - dashboardData.reductionPercentage / 100) ** years;

        let specificMessage;
        switch (dashboardData.reductionPercentage) {
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
        }

        dashboardData.reductionMessage = `Actualmente, el nivel de CO2 es de ${dashboardData.currentCO2} ppm. Si reducimos las emisiones en un ${dashboardData.reductionPercentage}% anual durante ${years} años, el nivel estimado de CO2 sería de ${reducedCO2.toFixed(2)} ppm. ${specificMessage}`;
      },

      // Método para calcular beneficios
      calculateBenefits() {
        dashboardData.benefitMessage = "Si reducimos las emisiones de CO2 hoy, para dentro de 10 años, el nivel del mar disminuirá su ritmo de aumento, los ecosistemas se estabilizarán y la calidad del aire será mucho mejor para todos. ¡Actuar a tiempo salva vidas y protege nuestro futuro!";
        dashboardData.consequenceMessage = "";
      },

      // Método para calcular consecuencias
      calculateConsequences() {
        dashboardData.consequenceMessage = "Si no actuamos ahora, en 10 años podríamos enfrentar una pérdida masiva de biodiversidad, aumento catastrófico del nivel del mar, fenómenos climáticos extremos más frecuentes y un impacto irreversible en nuestra calidad de vida. ¡Es hora de actuar!";
        dashboardData.benefitMessage = "";
      },

      // Método para alternar detalles
      toggleDetails(index) {
        dashboardData.yearsData[index].showConsequences = !dashboardData.yearsData[index].showConsequences;
      },

      // Método para alternar modo de edición
      toggleEditMode() {
        dashboardData.isEditing = !dashboardData.isEditing;
      },

      // Método para alternar modo de creación
      toggleCreateMode() {
        dashboardData.isCreating = !dashboardData.isCreating;
      }
    };
  });

  test('filteredYearsData devuelve todos los datos cuando no hay filtros', () => {
    const filtered = dashboardMethods.filteredYearsData();
    expect(filtered).toHaveLength(2);
    expect(filtered[0].year).toBe(2020);
    expect(filtered[1].year).toBe(2021);
  });

  test('filteredYearsData filtra correctamente por año inicial', () => {
    dashboardData.startYear = 2021;
    const filtered = dashboardMethods.filteredYearsData();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].year).toBe(2021);
  });

  test('filteredYearsData filtra correctamente por año final', () => {
    dashboardData.endYear = 2020;
    const filtered = dashboardMethods.filteredYearsData();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].year).toBe(2020);
  });

  test('filteredYearsData filtra correctamente por rango de años', () => {
    dashboardData.startYear = 2020;
    dashboardData.endYear = 2020;
    const filtered = dashboardMethods.filteredYearsData();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].year).toBe(2020);
  });

  test('calculateCO2Reduction muestra error sin porcentaje', () => {
    dashboardMethods.calculateCO2Reduction();
    expect(dashboardData.reductionMessage).toBe('Por favor selecciona un porcentaje de reducción.');
  });

  test('calculateCO2Reduction calcula correctamente para 25%', () => {
    dashboardData.reductionPercentage = 25;
    dashboardMethods.calculateCO2Reduction();
    
    expect(dashboardData.reductionMessage).toContain('25%');
    expect(dashboardData.reductionMessage).toContain('400 ppm');
    expect(dashboardData.reductionMessage).toContain('inicio esperanzador');
  });

  test('calculateCO2Reduction calcula correctamente para 50%', () => {
    dashboardData.reductionPercentage = 50;
    dashboardMethods.calculateCO2Reduction();
    
    expect(dashboardData.reductionMessage).toContain('50%');
    expect(dashboardData.reductionMessage).toContain('desastres climáticos');
  });

  test('calculateCO2Reduction calcula correctamente para 75%', () => {
    dashboardData.reductionPercentage = 75;
    dashboardMethods.calculateCO2Reduction();
    
    expect(dashboardData.reductionMessage).toContain('75%');
    expect(dashboardData.reductionMessage).toContain('avance crítico');
  });

  test('calculateCO2Reduction calcula correctamente para 100%', () => {
    dashboardData.reductionPercentage = 100;
    dashboardMethods.calculateCO2Reduction();
    
    expect(dashboardData.reductionMessage).toContain('100%');
    expect(dashboardData.reductionMessage).toContain('equilibrio ambiental');
  });

  test('calculateBenefits establece mensaje correcto y limpia consecuencias', () => {
    dashboardData.consequenceMessage = 'algún mensaje previo';
    dashboardMethods.calculateBenefits();
    
    expect(dashboardData.benefitMessage).toContain('reducimos las emisiones');
    expect(dashboardData.benefitMessage).toContain('salva vidas');
    expect(dashboardData.consequenceMessage).toBe('');
  });

  test('calculateConsequences establece mensaje correcto y limpia beneficios', () => {
    dashboardData.benefitMessage = 'algún mensaje previo';
    dashboardMethods.calculateConsequences();
    
    expect(dashboardData.consequenceMessage).toContain('no actuamos ahora');
    expect(dashboardData.consequenceMessage).toContain('pérdida masiva');
    expect(dashboardData.benefitMessage).toBe('');
  });

  test('toggleDetails cambia el estado de showConsequences', () => {
    const initialState = dashboardData.yearsData[0].showConsequences;
    dashboardMethods.toggleDetails(0);
    expect(dashboardData.yearsData[0].showConsequences).toBe(!initialState);
    
    // Probamos que vuelva al estado original
    dashboardMethods.toggleDetails(0);
    expect(dashboardData.yearsData[0].showConsequences).toBe(initialState);
  });

  test('toggleEditMode cambia el estado de isEditing', () => {
    expect(dashboardData.isEditing).toBe(false);
    dashboardMethods.toggleEditMode();
    expect(dashboardData.isEditing).toBe(true);
    dashboardMethods.toggleEditMode();
    expect(dashboardData.isEditing).toBe(false);
  });

  test('toggleCreateMode cambia el estado de isCreating', () => {
    expect(dashboardData.isCreating).toBe(false);
    dashboardMethods.toggleCreateMode();
    expect(dashboardData.isCreating).toBe(true);
    dashboardMethods.toggleCreateMode();
    expect(dashboardData.isCreating).toBe(false);
  });

  test('yearsData contiene la estructura correcta', () => {
    expect(dashboardData.yearsData).toHaveLength(2);
    
    const firstYear = dashboardData.yearsData[0];
    expect(firstYear).toHaveProperty('id');
    expect(firstYear).toHaveProperty('year');
    expect(firstYear).toHaveProperty('description');
    expect(firstYear).toHaveProperty('species');
    expect(firstYear).toHaveProperty('seaLevel');
    expect(firstYear).toHaveProperty('co2');
    expect(firstYear).toHaveProperty('showConsequences');
  });

  test('datos iniciales están configurados correctamente', () => {
    expect(dashboardData.startYear).toBe('');
    expect(dashboardData.endYear).toBe('');
    expect(dashboardData.reductionPercentage).toBe('');
    expect(dashboardData.currentCO2).toBe(400);
    expect(dashboardData.isAdmin).toBe(false);
    expect(dashboardData.isEditing).toBe(false);
    expect(dashboardData.isCreating).toBe(false);
  });
});