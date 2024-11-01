// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router/index'
// import firebase from 'firebase'

// VueElementVue.config.productionTip = false;

// let app=null;
// firebase.auth().onAuthStateChanged()(()=>{

//     if(!app){
//         new VueElementVue({
//             router,
//             render:h=> h(App)
//         }).$mount('#app')
//     }
// })

// createApp(App).use(router).mount('#app')

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importa los módulos necesarios de Firebase

// Variable para controlar si la app ya ha sido montada
let app = null;

const auth = getAuth();
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App).use(router).mount('#app');
  }
});


