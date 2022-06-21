<template>
  <div class="login">
    <h1>Inicio de sesión / Registro</h1>
    <div class="p-fluid grid"> 
      <div class="field col-0 md:col-1"> </div> 
      <div class="field col-12 md:col-10">  
    <div class="card">
    <div v-if="!autenticado" class="p-fluid grid">
        <div class="p-col-5 p-d-flex p-ai-center p-jc-center md:col-5">
            <div class="p-fluid ">
                <h3>INICIAR SESIÓN</h3>
                <div class="p-field ">
                    <label for="username">Correo electrónico</label>
                    <InputText v-model="emailLogin" id="username" type="text" />
                </div>
                <div class="p-field"><br>
                    <label for="password">Contraseña</label><br>
                    <Password id="password" v-model="passLogin" toggleMask :feedback="false" @keypress.enter="loginEmail"></Password>                    
                </div><br>
                <Button v-on:click="loginEmail" label="Iniciar sesión"></Button>
                </div>
        </div>

        <div  class="p-col-2 md:col-2">
            <Divider layout="vertical" type="dashed"/>
        </div>
      <!-- REGISTRO -->
        <div class="p-col-5 p-d-flex p-ai-center p-jc-center md:col-5">
          <div class="p-fluid">
            <h3>REGISTRARSE</h3>
            <div class="p-field">
                <label for="username">Correo electrónico</label>
                <InputText id="username" v-model="emailRegistro" type="text" />
            </div><br>
            <div class="p-field">
                <label for="pass1">Contraseña</label>
                <Password v-model="passRegistro" toggleMask>
                  <template #header>
                      <h5>Seleccione una contraseña</h5>
                  </template>
                  <template #footer>
                      <Divider />
                      <p class="p-mt-2">Sugerencias</p>
                      <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
                          <li>Al menos un carácter en minúscula</li>
                          <li>Al menos un carácter en mayúscula</li>
                          <li>Al menos un número</li>
                          <li>Mínimo 6 caracteres</li>
                      </ul>
                  </template>
                </Password>
            </div><br>
            <div class="p-field">
                <label for="pass2">Repetir Contraseña</label>
                <Password id="pass2" v-model="passRegConfirma" toggleMask :feedback="false"></Password>
                
            </div>    
            <div class="p-field-checkbox"><br>
              <ToggleButton v-model="checked" onLabel="Acepto los términos de servicio y uso" offLabel="Debe aceptar los términos de servicio y uso" onIcon="pi pi-check" offIcon="pi pi-times" />                         
            </div><br>
              <Button v-on:click="crearEmail" label="Registrarse" icon="pi pi-user-plus" class="p-button-success"></Button>
              <h4 v-if="checkSamePass()">ALERTA: Las contraseñas deben coincidir </h4> 
              <h4 >{{mensajeError}}</h4> 
            </div>                         
        </div>
    </div>
    <div v-if="autenticado"> 
      <h3> Has iniciado sesión como <i> {{emailLogin}} </i>. Pulsa aquí para <a v-on:click="logout" > <u>cerrar sesión</u> </a></h3>
    </div>
</div>
</div>
    <div class="field col-0 md:col-1"> </div>
    </div>
    
    
  </div>
</template>

<script>
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ToggleButton from 'primevue/togglebutton';
import Password from 'primevue/password';
import Firebase from '../db.js';
import firebase from 'firebase/app';
import {db} from'../db.js';

export default {
    name: "iniciarsesion",  
  components:{
    'Divider': Divider,
    'Button': Button,
    'InputText':InputText,
    'ToggleButton':ToggleButton,
    'Password':Password
  },    
  mounted: function() {
    Firebase.auth.onAuthStateChanged( user => {
      if (user) {
        this.user.loggedIn = true;
        this.user.data = user;
        this.emailLogin=user.email;
      }
      else {
        this.user.loggedIn = false;
        this.user.data = {};
      }
    })      
  },
  data(){
    return{
      checked: false,
      user: {
          loggedIn: false,
          data: {}
        },
      emailRegistro:'',
      passRegistro:'',
      passRegConfirma:'',
      emailLogin:'',
      passLogin:'',
      error:'',
      mensajeError:'',
      datos:{
        rol: 'usuario'
      }
      }
  },
    methods: {
      loginEmail: function () {
        if(this.emailLogin&&this.passLogin)
        {
          Firebase.loginEmail(this.emailLogin, this.passLogin);  
        }
                  
      },crearEmail: function(){
        let self=this;
        if (this.emailRegistro && (this.passRegistro==this.passRegConfirma)&&this.checked){
          firebase.auth().createUserWithEmailAndPassword(this.emailRegistro, this.passRegistro)
          .then((userCredential) => {
              console.log(userCredential);
              let user = userCredential.user;
              console.log(user.email);
              this.comprobarRol(user.email);              
          })
          .catch((error) => {
              console.warn("Error " + error.code + ": "+ error.message);
              self.error=error.code;
          }).finally(function(){
            if(self.error=="auth/email-already-in-use"){
              console.log("yep")
              self.mensajeError="Email ya en uso";
            } else 
            if (self.error=="auth/invalid-email"){
              self.mensajeError="Email inválido."
            }else 
            if (self.error=="auth/weak-password"){
              self.mensajeError="Contraseña demasiado débil"
            }
          }            
          )
        }
      },
      comprobarRol(email){
        db.collection('trabajadores').where("email", "==", email)
        .get()
        .then((querySnapshot) => { 
          if (querySnapshot.size<1) {
              this.datos.rol = 'usuario'; 
            }else{
              querySnapshot.forEach((doc) => {
                console.log(doc.data().esAdmin)
                if (doc.data().esAdmin){
                  this.datos.rol = 'admin';
                } else{
                  this.datos.rol = 'trabajador';
                } 
            });
            } 
            console.log(this.datos.rol) 
            this.subir('usuarios',email,this.datos);          
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });             
      },
      subir(email, documento, datos){        
        Firebase.crearColeccion(email,documento,datos)
      }, 
      bajar(coleccion,documento){
        var docRef=db.collection(coleccion).doc(documento);
        docRef.get().then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            this.datos=doc.data();
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
          }).catch((error) => {
          console.log("Error getting document:", error);
      });
      },
      logout: function(){
        Firebase.logout();
      },
      checkSamePass: function(){
        return (!(this.passRegistro==this.passRegConfirma)&&this.passRegConfirma!=''&&this.passRegistro!='');
      },
    },
    computed: {
        autenticado(){
          return this.user.loggedIn;
        }
    }
}
</script>

<style scoped>
.login{
  min-height: 80vh;
  padding: 20px;
  padding-top: 50px;
}
u{
  cursor: pointer;
}

</style>