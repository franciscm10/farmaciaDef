<template>  
  <div>
    <h1>Lista de Medicinas</h1>
    <Button @click="openAlta" class="boton" v-if="this.trabajador">Nueva medicina</Button> 
    <div class="p-fluid grid"> 
      <div class="field col-0 md:col-1"> </div> 
      <div class="field col-12 md:col-10">    
    <DataTable :value="coleccion" :paginator="true" :rows="20">
               
      <Column field="medId" header="Id. de Medicina" :sortable="true"></Column>
      <Column field="nombre" header="Nombre" :sortable="true"></Column>
      <Column field="descripcion" header="Descripción" :sortable="true"></Column>
      <Column field="tipo" header="Tipo" :sortable="true"></Column>
      <Column field="stock" header="Unidades disponibles" :sortable="true"></Column>
      <Column field="precio" header="Precio" :sortable="true"></Column> 
      <Column headerStyle="width: 8em" bodyStyle="text-align: center" v-if="this.admin||this.trabajador">
        <template #header> Acciones </template>
        <template #body="slotProps">
          <Button
            type="button"
            icon="pi pi-pencil"
            class="p-button-success"
            style="margin-right: 0.5em"  
            @click="seleccionarMedicina(slotProps.data.medId);openEdit();cargarMedicinaEdit(slotProps.data);"         
          ></Button>
          <Button
            type="button"
            icon="pi pi-times"
            class="p-button-danger"
            @click="openConfirmation();seleccionarMedicina(slotProps.data.medId)"             
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
            <span>Estás a punto de borrar una medicina de la base de datos, ¿Estás seguro?</span>
        </div>
        <template #footer>
            <Button label="No, mantener" icon="pi pi-times" @click="closeConfirmation" class="p-button-text"/>
            <Button label="Sí, borrar." icon="pi pi-check" @click="borrarMedicina(medIdBorrar);closeConfirmation();cargarMedicina();" class="p-button-text" autofocus />
        </template>
    </Dialog>

    <Dialog header="Editar Medicina" :visible="edit" :style="{width: '800px'}" :modal="true" @update:visible="closeEdit();limpiarCampos();cargarMedicina()">
        <div class="p-fluid grid">           
          <div class="field col-12 md:col-2">
            <label for="medId">Id. de Medicina</label>
            <InputText id="medId" type="username" aria-describedby="medId" v-model="datos.medId"/>
          </div>   
          <div class="field col-12 md:col-4">
            <label for="nombre">Nombre</label>
            <InputText id="nombre" type="username" aria-describedby="nombre" v-model="datos.nombre" />
          </div>
          <div class="field col-12 md:col-3">
            <label for="tipo">Tipo</label>
            <Dropdown v-model="datos.tipo" :options="utilidades" optionLabel="descripcion" optionValue="descripcion" placeholder="Tipo" />            
          </div>
          <div class="field col-12 md:col-6">
            <label for="descripcion">Descripción</label>
            <InputText id="descripcion" type="username" aria-describedby="descripcion" v-model="datos.descripcion"/>
          </div>  
          <div class="field col-12 md:col-3">
            <label for="stock">Stock</label>
            <InputText id="stock" type="username" aria-describedby="stock" v-model="datos.stock" />
          </div> 
          <div class="field col-12 md:col-3">
            <label for="precio">Precio</label>
            <InputText id="precio" type="username" aria-describedby="precio" v-model="datos.precio" />
          </div>  
                                
        </div>         
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="limpiarCampos();closeEdit();cargarMedicina()" class="p-button-text"/>
            <Button label="Guardar cambios" icon="pi pi-check" @click="borrarMedicina(medIdBorrar);subirMedicina('medicinas',datos.medId);limpiarCampos();closeEdit();cargarMedicina()" class="p-button-text" autofocus />
        </template>
    </Dialog>

    <Dialog header="Nueva medicina" :visible="alta" :style="{width: '800px'}" :modal="true" @update:visible="closeAlta();limpiarCampos();cargarMedicina()">
        <div class="p-fluid grid">           
          <div class="field col-12 md:col-2">
            <label for="medId">Id. de Medicina</label>
            <InputText id="medId" type="username" aria-describedby="medId" v-model="datos.medId"/>
          </div>   
          <div class="field col-12 md:col-4">
            <label for="nombre">Nombre</label>
            <InputText id="nombre" type="username" aria-describedby="nombre" v-model="datos.nombre" />
          </div>
          <div class="field col-12 md:col-3">
            <label for="tipo">Tipo</label>
            <Dropdown v-model="datos.tipo" :options="utilidades" optionLabel="descripcion" optionValue="descripcion" placeholder="Tipo" />            
          </div>
          <div class="field col-12 md:col-6">
            <label for="descripcion">Descripción</label>
            <InputText id="descripcion" type="username" aria-describedby="descripcion" v-model="datos.descripcion"/>
          </div>  
          <div class="field col-12 md:col-3">
            <label for="stock">Stock</label>
            <InputText id="stock" type="username" aria-describedby="stock" v-model="datos.stock" />
          </div> 
          <div class="field col-12 md:col-3">
            <label for="precio">Precio</label>
            <InputText id="precio" type="username" aria-describedby="precio" v-model="datos.precio" />
          </div> 
                                
        </div> 
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="closeAlta" class="p-button-text"/>
            <Button label="Dar de alta" icon="pi pi-check" @click="subirMedicina('medicinas',getMedId(datos.medId));limpiarCampos();closeAlta();cargarMedicina()" class="p-button-text" autofocus />
        </template>
    </Dialog>    
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
  name: "medicinas",
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
      utilidades:[
        {tipo:'Jarabe'},
        {tipo:'Pastilla'}
      ],
      medIdBorrar:'',      
      coleccion:[],
      datos:{
        medId:'',
        descripcion: '',
        nombre: '',
        precio: '',
        tipo: '',
        stock: ''  
      }
    };
  },
  methods: {    
    cargarMedicina() {
       db.collection('medicinas').where("medId", "!=", "0").orderBy("medId", "asc")
    .get()
    .then((querySnapshot) => {
        if (querySnapshot.size>0) {
          this.coleccion =[];
        }
        querySnapshot.forEach((doc) => {
           /*  console.log(doc.id, " => ", doc.data());  */           
            this.coleccion.push(doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    },
    cargarTipos(){      
       db.collection('tiposMed').where("tipoId", "!=", "0").orderBy("tipoId", "asc")
    .get()
    .then((querySnapshot) => {
        if (querySnapshot.size>0) {
          this.utilidades =[];
        }
        querySnapshot.forEach((doc) => {          
            this.utilidades.push(doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    }
    ,
    borrarMedicina(medicina){
      db.collection('medicinas').doc(this.getMedId(medicina)).delete();
      this.medIdBorrar = '';
    },
    subirMedicina(coleccion,documento) {
      this.datos.medId = this.getMedId(documento);
      Firebase.crearColeccion(coleccion, this.getMedId(documento), this.datos);
      this.cargarMedicina();
    },
    seleccionarMedicina(medId){
      this.medIdBorrar = medId;
    },
    cargarMedicinaEdit(datos){
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
      this.datos.medId = '';
      this.datos.descripcion = '';
      this.datos.nombre = '';    
      this.datos.precio = '';
      this.datos.stock = 0;          
    },
    getMedId(MedId){
      let nuevoId = '';
      let long = MedId.length;
      for (let i = 0; i < 3-long; i++) {
            nuevoId += '0'    
      }
      nuevoId += MedId;      
      return nuevoId;
    }
    ,
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
     this.cargarMedicina();
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