<template>

<div class="container" mt-50>
<div class="columns">
    <div class="column is-6 is-offset-3">
        <h3 class="title is-3">Crear una cuenta</h3>   
       <form action="#" @submit.prevent="register">
        <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" placeholder="e.g Alex Smith" v-model="name">
            </div>
          </div>
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input class="input" type="email" placeholder="e.g. alexsmith@gmail.com" v-model="email">
            </div>
          </div>

          <div class="field">
            <label class="label">Contrasena</label>
            <div class="control">
              <input class="input" type="password" v-model="password">
            </div>
          </div>

        <button type="submit" class="button is-primary"> Registrarme </button>
       </form> 

       <div class="notification is-danger mt-10" v-if="error">
        {{error}}
      </div>

    </div>
</div>
</div>
</template>

<script>
// import db from '@/firebase/init'
// import firebase from 'firebase'
import { auth } from '@/firebase/init';
// import { is } from 'core-js/core/object';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default{
    data () {
    return {
        name: '',
        email: '',
        password:'',
        error:''
        }
    },
name: 'Register',
methods: {
    register() {
        if (this.name && this.email && this.password){
            // console.log("Todos los campos están completos.");
            createUserWithEmailAndPassword(auth, this.email, this.password)
                    .then((userCredential) => {
                        // Obtén el usuario creado
                        const user = userCredential.user;
                        // Actualiza el perfil del usuario
                        return updateProfile(user, { displayName: this.name });
                    })
                    .then(() => {
                        // Reinicia los campos y redirige al dashboard
                        this.name = '';
                        this.email = '';
                        this.password = '';
                        this.$router.push({ name: 'dashboard' });
                    })
                    .catch((err) => {
                        this.error = err.message;
                    });
            } else {
                this.error = 'Todos los campos son requeridos';
            }
        }
    }
};
</script>