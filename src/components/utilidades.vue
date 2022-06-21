<template>
  <div>
  <div v-if="this.trabajador">
    <h1>Tipos de Medicinas</h1>
    <Button @click="openAlta" class="boton">Nueva Tipo de Medicina</Button>    
    <div class="p-fluid grid"> 
      <div class="field col-0 md:col-1"> </div> 
      <div class="field col-12 md:col-10">    
    <DataTable :value="coleccion" :paginator="true" :rows="10"  class="p-datatable-sm fondoazul">               
      <Column field="tipoId" header="Id. de Tipo de Medicina" :sortable="true"></Column> 
      <Column field="descripcion" header="Descripción" :sortable="true"></Column>
      
      <Column headerStyle="width: 8em" bodyStyle="text-align: center" v-if="this.admin||this.trabajador">
        <template #header> Acciones </template>
        <template #body="slotProps">
          <Button
            type="button"
            icon="pi pi-pencil"
            class="p-button-success"
            style="margin-right: 0.5em"  
            @click="seleccionarTipo(slotProps.data.tipoId);openEdit();cargarTipoEdit(slotProps.data);"         
          ></Button>
          <Button
            type="button"
            icon="pi pi-times"
            class="p-button-danger"
            @click="openConfirmation();seleccionarTipo(slotProps.data.tipoId)"             
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
            <span>Estás a punto de borrar un tipo de medicina de la base de datos, ¿Estás seguro?</span>
        </div>
        <template #footer>
            <Button label="No, mantener" icon="pi pi-times" @click="closeConfirmation" class="p-button-text"/>
            <Button label="Sí, borrar." icon="pi pi-check" @click="borrarTipo(tipoIdBorrar);closeConfirmation();cargarTipos();" class="p-button-text" autofocus />
        </template>
    </Dialog>

    <Dialog header="Editar Tipo" :visible="edit" :style="{width: '800px'}" :modal="true" @update:visible="closeEdit();limpiarCampos();cargarTipos()">
        <div class="p-fluid grid">           
          <div class="field col-12 md:col-4">
            <label for="tipoId">Id. de Tipo de Medicina</label>
            <InputText id="tipoId" type="username" aria-describedby="tipoId" v-model="datos.tipoId"/>
          </div>   
          <div class="field col-12 md:col-8">
            <label for="descripcion">Descripción</label>
            <InputText id="descripcion" type="username" aria-describedby="descripcion" v-model="datos.descripcion" />
          </div>  <br>        
                                
        </div>         
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="limpiarCampos();closeEdit();cargarTipos()" class="p-button-text"/>
            <Button label="Guardar cambios" icon="pi pi-check" @click="borrarTipo(tipoIdBorrar);subirTipo('tiposMed',datos.tipoId);limpiarCampos();closeEdit();cargarTipos()" class="p-button-text" autofocus />
        </template>
    </Dialog>

    <Dialog header="Nuevo tipo de medicina" :visible="alta" :style="{width: '800px'}" :modal="true" @update:visible="closeAlta();limpiarCampos();cargarTipos()">
        <div class="p-fluid grid">           
          <div class="field col-12 md:col-4">
            <label for="tipoId">Id. de Tipo de Medicina</label>
            <InputText id="tipoId" type="username" aria-describedby="tipoId" v-model="datos.tipoId"/>
          </div>   
          <div class="field col-12 md:col-8">
            <label for="descripcion">Descripción</label>
            <InputText id="descripcion" type="username" aria-describedby="descripcion" v-model="datos.descripcion" />
          </div>  <br>           
        </div> 
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="closeAlta" class="p-button-text"/>
            <Button label="Dar de alta" icon="pi pi-check" @click="subirTipo('tiposMed',getTipoId(datos.tipoId));limpiarCampos();closeAlta();cargarTipos()" class="p-button-text" autofocus />
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
import firebase from 'firebase/app';

export default {
  name: "utilidades",
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
  },
  data() {
    return {
      displayConfirmation:false,
      edit:false,
      alta:false,
      admin: false,
      trabajador: false,      
      tipoIdBorrar:'',      
      coleccion:[],
      datos:{
        tipoId:'',
        descripcion: ''        
      }
    };
  },
  methods: {   
    cargarTipos(){      
       db.collection('tiposMed').where("tipoId", "!=", "0").orderBy("tipoId", "asc")
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
    }
    ,
    borrarTipo(tipo){
      db.collection('tiposMed').doc(this.getTipoId(tipo)).delete();
      this.tipoIdBorrar = '';
    },
    subirTipo(coleccion,documento) {
      this.datos.tipoId = this.getTipoId(documento);
      Firebase.crearColeccion(coleccion, this.getTipoId(documento), this.datos);
      this.cargarTipos();
    },
    seleccionarTipo(tipoId){
      this.tipoIdBorrar = tipoId;
    },
    cargarTipoEdit(datos){
      this.datos = datos; 
    },
    limpiarCampos(){
      this.datos.tipoId = '';
      this.datos.descripcion = '';               
    },
    getTipoId(tipoId){
      let nuevoId = '';
      let long = tipoId.length;
      for (let i = 0; i < 3-long; i++) {
            nuevoId += '0'    
      }
      nuevoId += tipoId;      
      return nuevoId;
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
     this.cargarTipos();
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