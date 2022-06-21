<template>
<div>
  <div v-if="this.trabajador">
    <h1>Nuestra plantilla de Trabajadores</h1>
    <Button @click="openAlta" class="boton" v-if="this.admin">Dar de alta</Button> 
    <div class="p-fluid grid"> 
      <div class="field col-0 md:col-1"> </div> 
      <div class="field col-12 md:col-10">   
    <DataTable :value="coleccion" :paginator="true" :rows="5">
      <Column field="foto" header="Foto">
        <template #body="slotProps">
          <img
            :src="slotProps.data.foto"
            :alt="slotProps.data.foto"
            width="48px"
          />
        </template>
      </Column>     
      <Column field="email" header="Email" :sortable="true"></Column>
      <Column field="nombre" header="Nombre" :sortable="true"></Column>
      <Column field="apellidos" header="Apellidos" :sortable="true"></Column>
      <Column field="DNI" header="DNI" :sortable="true"></Column>
      <Column field="sueldo" header="Sueldo" :sortable="true"></Column>
      <Column field="esAdmin" header="Administrador">
      <template #body="slotProps">
        <InputSwitch v-model="slotProps.data.esAdmin" :disabled="true"/>
      </template>
      </Column>
      <Column headerStyle="width: 8em" bodyStyle="text-align: center" v-if="this.admin">
        <template #header> Acciones </template>
        <template #body="slotProps">
          <Button
            type="button"
            icon="pi pi-pencil"
            class="p-button-success"
            style="margin-right: 0.5em"  
            @click="seleccionarTrabajador(slotProps.data.DNI);openEdit();cargarTrabajadorEdit(slotProps.data);"         
          ></Button>
          <Button
            type="button"
            icon="pi pi-times"
            class="p-button-danger"
            @click="openConfirmation();seleccionarTrabajador(slotProps.data.DNI)"             
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
            <span>Estás a punto de borrar un trabajador de la base de datos, ¿Estás seguro?</span>
        </div>
        <template #footer>
            <Button label="No, mantener" icon="pi pi-times" @click="closeConfirmation" class="p-button-text"/>
            <Button label="Sí, borrar." icon="pi pi-check" @click="borrarTrabajador(DNIBorrar);closeConfirmation();cargarTrabajador();" class="p-button-text" autofocus />
        </template>
    </Dialog>

    <Dialog header="Editar trabajador" :visible="edit" :style="{width: '800px'}" :modal="true" @update:visible="closeEdit();limpiarCampos();cargarTrabajador()">
        <div class="p-fluid grid">          
          <div class="field col-12 md:col-4">
            <label for="Nombre">Nombre</label>
            <InputText id="Nombre" type="username" aria-describedby="Nombre" v-model="datos.nombre"/>
          </div>   
          <div class="field col-12 md:col-4">
            <label for="Apellidos">Apellidos</label>
            <InputText id="Apellidos" type="username" aria-describedby="Apellidos" v-model="datos.apellidos" />
          </div>  <br>
          <div class="field col-12 md:col-4">
            <label for="DNI">DNI</label>
            <InputText id="DNI" type="username" aria-describedby="DNI" v-model="datos.DNI"/>
          </div>  
          <div class="field col-12 md:col-8">
            <label for="Email">Email</label>
            <InputText id="Email" type="username" aria-describedby="Email" v-model="datos.email" />
          </div>  
          <div class="field col-12 md:col-4">
            <label for="Sueldo">Sueldo</label>
            <InputText id="Sueldo" type="username" aria-describedby="Sueldo" v-model="datos.sueldo"/>
          </div>  
          
          <div class="field col-12 md:col-6">
            <label for="Foto">Foto</label>
            <InputText  id="Foto" type="username" aria-describedby="Foto" v-model="datos.foto"/>
          </div> 
          <img
            :src="datos.foto"
            :alt="datos.foto"
            width="200vw"
          />
          <div class="field col-12 md:col-2">
            <label for="Administrador">Administrador</label>
            <InputSwitch v-model="datos.esAdmin"/>
          </div> 
           <div >
            <Button @click="click1">Cambiar foto</Button>
            <input type="file" ref="input1"
            style="display: none"
            @change="previewImage" accept="image/*" >                
          </div>                    
        </div>         
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="limpiarCampos();closeEdit();cargarTrabajador()" class="p-button-text"/>
            <Button label="Guardar cambios" icon="pi pi-check" @click="borrarTrabajador(DNIBorrar);subirTrabajador('trabajadores',datos.DNI);limpiarCampos();closeEdit();cargarTrabajador()" class="p-button-text" autofocus />
        </template>
    </Dialog>

    <Dialog header="Dar de alta trabajador" :visible="alta" :style="{width: '800px'}" :modal="true" @update:visible="closeAlta();limpiarCampos();cargarTrabajador()">
        <div class="p-fluid grid">          
          <div class="field col-12 md:col-4">
            <label for="Nombre">Nombre</label>
            <InputText id="Nombre" type="username" aria-describedby="Nombre" v-model="datos.nombre"/>
          </div>   
          <div class="field col-12 md:col-4">
            <label for="Apellidos">Apellidos</label>
            <InputText id="Apellidos" type="username" aria-describedby="Apellidos" v-model="datos.apellidos" />
          </div>  <br>
          <div class="field col-12 md:col-4">
            <label for="DNI">DNI</label>
            <InputText id="DNI" type="username" aria-describedby="DNI" v-model="datos.DNI"/>
          </div>  
          <div class="field col-12 md:col-8">
            <label for="Email">Email</label>
            <InputText id="Email" type="username" aria-describedby="Email" v-model="datos.email" />
          </div>  
          <div class="field col-12 md:col-4">
            <label for="Sueldo">Sueldo</label>
            <InputText id="Sueldo" type="username" aria-describedby="Sueldo" v-model="datos.sueldo"/>
          </div>  
          
          <div class="field col-12 md:col-6">
            <label for="Foto">Foto</label>
            <InputText  id="Foto" type="username" aria-describedby="Foto" v-model="datos.foto"/>
          </div> 
          <img
            :src="datos.foto"
            :alt="datos.foto"
            width="200vw"
          />          
          <div class="field col-12 md:col-2">
            <label for="Administrador">Administrador</label>
            <InputSwitch v-model="datos.esAdmin"/>
          </div> 
          <div >
            <Button @click="click1">Subir foto</Button>
            <input type="file" ref="input1"
            style="display: none"
            @change="previewImage" accept="image/*" >                
          </div>                   
        </div> 
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="closeAlta" class="p-button-text"/>
            <Button label="Dar de alta" icon="pi pi-check" @click="subirTrabajador('trabajadores',datos.DNI);limpiarCampos();closeAlta();cargarTrabajador()" class="p-button-text" autofocus />
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
import InputSwitch from 'primevue/inputswitch';
import firebase from 'firebase/app';

export default {
  name: "trabajadores",
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
    InputSwitch
  },
  data() {
    return {
      displayConfirmation:false,
      edit:false,
      alta:false,
      DNIBorrar:'', 
      admin: false,
      trabajador: false,           
      coleccion:[],
      datos:{
        DNI:'',
        apellidos: '',
        email: '',
        esAdmin: false,
        foto:'',
        nombre: '',
        sueldo: 0
      }
    };
  },
  methods: {
    cargarTrabajador() {
       db.collection('trabajadores').where("email", "!=", "0").orderBy("email", "asc")
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
    borrarTrabajador(trabajador){
      db.collection('trabajadores').doc(trabajador).delete();
      this.DNIBorrar = '';
    },
    subirTrabajador(coleccion,documento) {
      Firebase.crearColeccion(coleccion, documento, this.datos);
      this.cargarTrabajador();
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
    seleccionarTrabajador(DNI){
      this.DNIBorrar = DNI;
    },
    cargarTrabajadorEdit(datos){
      this.datos = datos;    
    },
    limpiarCampos(){
      this.datos.DNI = '';
      this.datos.apellidos = '';
      this.datos.email = '';
      this.datos.esAdmin = false;
      this.datos.foto = '';
      this.datos.nombre = '';
      this.datos.sueldo = 0;     
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
    },
    click1() {
      this.$refs.input1.click()   
      },
      previewImage(event) {
        this.uploadValue=0;
        this.datos.foto=null;
        this.imageData = event.target.files[0];
        this.onUpload()
      },
      onUpload(){
        this.datos.foto=null;
        const storageRef=firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
        storageRef.on(`state_changed`,snapshot=>{
        this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          }, error=>{console.log(error.message)},
        ()=>{this.uploadValue=100;
            storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                this.datos.foto =url;
                console.log(this.datos.foto)
              });
            }      
          );
      }
  },
  mounted(){
     this.cargarTrabajador();
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
.field * {
    display: block;
}
.boton{
  margin-bottom: 2rem;
}
</style>