<template>

    <div class="container" mt-50>
    <div class="columns">
        <div class="column is-6 is-offset-3">
            <h3 class="title is-3">Iniciar Sesion</h3>   
           <form action="#" @submit.prevent="login">

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
    
            <button type="submit" class="button is-primary"> Iniciar Sesion </button>
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
    import { signInWithEmailAndPassword } from 'firebase/auth';
    
    export default{
        data () {
        return {
            email: '',
            password:'',
            error:'',
            user: null
            }
        },
    name: 'Login',
    methods: {
        login() {
            if (this.email && this.password){
                signInWithEmailAndPassword(auth,this.email, this.password)
                .then(result => {
                    this.user= result.user;
                    this.$router.push({name:'dashboard'})
                })
                .catch(err=>{
                    this.error=err.message;
                });
            }else{
                this.error= 'Todos los campos son requeridos';
            }
        }
    }
    }
    </script>