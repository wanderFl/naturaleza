# login
# Proyecto Final - Filtrado de Empleados con Vue.js y Firebase

Este proyecto implementa una aplicación web para gestionar y filtrar empleados, utilizando el framework Vue.js para el frontend y Firebase para la autenticación y gestión de datos. Los datos incluyen una lista de empleados con sus resultados en tareas y proyectos asignados. El objetivo es ofrecer una herramienta intuitiva para visualizar y filtrar el desempeño de empleados de acuerdo con sus resultados.

## Características

- **Autenticación de usuarios** con Firebase Authentication.
- **Gestión de empleados**: permite listar y buscar empleados por su desempeño en diferentes tareas y proyectos.
- **Interfaz amigable** desarrollada en Vue.js.
- **Conexión en tiempo real** con Firebase Firestore para sincronizar los datos.

## Estructura del Proyecto

```
src/
├── assets/                      # Archivos estáticos (CSS, imágenes, etc.)
├── components/                  # Componentes de Vue
│   ├── Navigation.vue           # Componente para la navegar 
├── firebase/                    # Configuración de Firebase
│   └── init.js                  # Configuración y conexión con Firebase
│──router                        # Componente de router
│   └──index.js                  # Conexiones entre paginas
│──scss                          # Componente de scsss
│   ├── helpers                  # Carpeta de helpers
│   ├   ├──_helpers.scss         # Diseño
│   └──App.scss                  # Importacion de bulma
├── views/                       # Vistas de la aplicación
│   ├── Auth                     # Carpeta Auth
│   ├── Login.vue                # Vista de login de usuario
│   ├── Dashboard.vue            # Vista del panel principal
│   └── Register.vue             # Vista de registro de usuario
├── App.vue                      # Componente raíz de la aplicación
├── main.js                      # Punto de entrada principal
└── router.js                    # Configuración de rutas de la aplicación
```

### Pre requisitos

- Tener instalado [Node.js](https://nodejs.org/).
- Tener una cuenta de Firebase y crear un proyecto para obtener las credenciales.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
### Configurar Firebase

En la carpeta `src/firebase/`, crea un archivo `firebaseConfig.js` e incluye la configuración de tu proyecto Firebase:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

La aplicación estará disponible en `http://localhost:8081`.


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Contacto

Si tienes alguna consulta o sugerencia, puedes contactarme a:
- wanderley.flores@udla.edu.ec
