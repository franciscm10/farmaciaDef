<template>
  <div>
  <div v-if="this.trabajador">
    <h1>Nuestros clientes</h1>
    <Button @click="openAlta" class="boton">Nuevo cliente</Button>  
    <div class="p-fluid grid"> 
      <div class="field col-0 md:col-1"> </div> 
      <div class="field col-12 md:col-10">   
    <DataTable :value="coleccion" :paginator="true" :rows="5">
               
      <Column field="nombre" header="Nombre" :sortable="true"></Column>
      <Column field="apellidos" header="Apellidos" :sortable="true"></Column>
      <Column field="email" header="Email" :sortable="true"></Column>
      <Column field="DNI" header="DNI" :sortable="true"></Column>
      <Column field="sexo" header="Sexo" :sortable="true"></Column>
      <Column headerStyle="width: 8em" bodyStyle="text-align: center" v-if="this.admin||this.trabajador">
        <template #header> Acciones </template>
        <template #body="slotProps">
          <Button
            type="button"
            icon="pi pi-pencil"
            class="p-button-success"
            style="margin-right: 0.5em"  
            @click="seleccionarCliente(slotProps.data.DNI);openEdit();cargarClienteEdit(slotProps.data);"         
          ></Button>
          <Button
            type="button"
            icon="pi pi-times"
            class="p-button-danger"
            @click="openConfirmation();seleccionarCliente(slotProps.data.DNI)"             
          ></Button>
        </template>
      </Column>
    </DataTable>
      </div>
    <div class="field col-0 md:col-1"> </div>
    </div>
    <Dialog header="Confirmación" :visible="displayConfirmation" :style="{width: '350px'}" :modal="true"  @update:visible="closeConfirmation">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Estás a punto de borrar un cliente de la base de datos, ¿Estás seguro?</span>
        </div>
        <template #footer>
            <Button label="No, mantener" icon="pi pi-times" @click="closeConfirmation" class="p-button-text"/>
            <Button label="Sí, borrar." icon="pi pi-check" @click="borrarCliente(DNIBorrar);closeConfirmation();cargarCliente();" class="p-button-text" autofocus />
        </template>
    </Dialog>

    <Dialog header="Editar cliente" :visible="edit" :style="{width: '800px'}" :modal="true" @update:visible="closeEdit();limpiarCampos();cargarCliente()">
        <div class="p-fluid grid">           
          <div class="field col-12 md:col-3">
            <label for="Nombre">Nombre</label>
            <InputText id="Nombre" type="username" aria-describedby="Nombre" v-model="datos.nombre"/>
          </div>   
          <div class="field col-12 md:col-5">
            <label for="Apellidos">Apellidos</label>
            <InputText id="Apellidos" type="username" aria-describedby="Apellidos" v-model="datos.apellidos" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="sexo">Sexo</label>
            <Dropdown v-model="datos.sexo" :options="sexos" optionLabel="sexo" optionValue="sexo" placeholder="Sexo" />            
          </div>
          <div class="field col-12 md:col-3">
            <label for="DNI">DNI</label>
            <InputText id="DNI" type="username" aria-describedby="DNI" v-model="datos.DNI"/>
          </div>  
          <div class="field col-12 md:col-8">
            <label for="Email">Email</label>
            <InputText id="Email" type="username" aria-describedby="Email" v-model="datos.email" />
          </div>                 
        </div>         
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="limpiarCampos();closeEdit();cargarCliente()" class="p-button-text"/>
            <Button label="Guardar cambios" icon="pi pi-check" @click="borrarCliente(DNIBorrar);subirCliente('clientes',datos.DNI);limpiarCampos();closeEdit();cargarCliente()" class="p-button-text" autofocus />
        </template>
    </Dialog>

    <Dialog header="Nuevo cliente" :visible="alta" :style="{width: '800px'}" :modal="true" @update:visible="closeAlta();limpiarCampos();cargarCliente()">
        <div class="p-fluid grid">          
          <div class="field col-12 md:col-3">
            <label for="Nombre">Nombre</label>
            <InputText id="Nombre" type="username" aria-describedby="Nombre" v-model="datos.nombre"/>
          </div>   
          <div class="field col-12 md:col-5">
            <label for="Apellidos">Apellidos</label>
            <InputText id="Apellidos" type="username" aria-describedby="Apellidos" v-model="datos.apellidos" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="sexo">Sexo</label>
            <Dropdown v-model="datos.sexo" :options="sexos" optionLabel="sexo" optionValue="sexo" placeholder="Sexo" />            
          </div>
          <div class="field col-12 md:col-3">
            <label for="DNI">DNI</label>
            <InputText id="DNI" type="username" aria-describedby="DNI" v-model="datos.DNI"/>
          </div>  
          <div class="field col-12 md:col-8">
            <label for="Email">Email</label>
            <InputText id="Email" type="username" aria-describedby="Email" v-model="datos.email" />
          </div>            
        </div> 
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="closeAlta" class="p-button-text"/>
            <Button label="Dar de alta" icon="pi pi-check" @click="subirCliente('clientes',datos.DNI);limpiarCampos();closeAlta();cargarCliente()" class="p-button-text" autofocus />
        </template>
    </Dialog>
  </div>  
  <div v-if="!this.trabajador">
     <h3>Actualmente estás visitando el sitio web como Invitado.</h3><h3> Si no eres un empleado no deberías de estar viendo esta página.</h3>
     <h2>Devuélveme a <router-link to="/">Inicio</router-link></h2>
   </div>
   </div>
</template>
                  
<script>
import {db} from'../db.js';
import Firebase from '../db.js';

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Dropdown from 'primevue/dropdown';
import firebase from 'firebase/app';

export default {
  name: "cliente",
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
    Dropdown,
  },
  data() {
    return {
      displayConfirmation:false,
      edit:false,
      alta:false,
      admin: false,
      trabajador: false, 
      sexos:[
        {sexo:'Hombre'},
        {sexo:'Mujer'}
      ],
      DNIBorrar:'',      
      coleccion:[],
      datos:{
        DNI:'',
        apellidos: '',
        email: '',
        nombre: '',
        sexo: ''        
      }
    };
  },
  methods: {    
    cargarCliente() {
       db.collection('clientes').where("email", "!=", "0").orderBy("email", "asc")
    .get()
    .then((querySnapshot) => {
        if (querySnapshot.size>0) {
          this.coleccion =[];
        }
        querySnapshot.forEach((doc) => {          
            this.coleccion.push(doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    },
    borrarCliente(cliente){
      db.collection('clientes').doc(cliente).delete();
      this.DNIBorrar = '';
    },
    subirCliente(coleccion,documento) {
      Firebase.crearColeccion(coleccion, documento, this.datos);
      this.cargarCliente();
    },
    seleccionarCliente(DNI){
      this.DNIBorrar = DNI;
    },
    cargarClienteEdit(datos){
      this.datos = datos;   
    },
    getRol(email){
        db.collection('usuarios').doc(email).get()
        .then((doc) => { 
          if (doc.exists) {
            console.log(doc.data().rol) 
            if(doc.data().rol=='admin'){
              this.admin = true; 
              this.trabajador = true;           
            }else if(doc.data().rol=='trabajador'){
              this.admin = false;
              this.trabajador = true;
            }else{
              this.admin = false;
              this.trabajador = false;
            }             
          }else{
            console.log("No such document!");
          } 
                  
        })
        .catch((error) => {
            console.log("Error getting document: ", error);
        });             
      },
    limpiarCampos(){
      this.datos.DNI = '';
      this.datos.apellidos = '';
      this.datos.email = '';    
      this.datos.nombre = '';
      this.datos.sexo = '';          
    },
    openAlta(){
      this.alta = true;
    },
    closeAlta(){
      this.alta = false;  
    },
    openEdit() {
      this.edit = true;
    },
    closeEdit(){
      this.edit = false;
    },
    openConfirmation(){
    this.displayConfirmation = true;
    },
    closeConfirmation(){
      this.displayConfirmation = false;
    }
  },
  mounted(){
     this.cargarCliente();
     let user = firebase.auth().currentUser;
     if(firebase.auth().currentUser){       
       this.getRol(user.email)      
     } 
  }
};
</script>

<style scoped lang="scss">
.p-button {
    margin: 0.3rem .5rem;
    min-width: 4rem;
}

p {
    margin: 0;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-dialog .p-button {
    min-width: 3rem;
}
.boton{
  margin-bottom: 2rem;
}
</style>